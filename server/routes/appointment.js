const express = require("express");
const { body, validationResult } = require("express-validator");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

// Get appointments
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate, status, doctorId, patientId } = req.query;
    let query = {};

    // Filter by user role
    if (req.user.role === "patient") {
      query.patientId = req.user._id;
    } else if (req.user.role === "doctor") {
      query.doctorId = req.user._id;
    }

    // Apply additional filters
    if (startDate && endDate) {
      query.dateTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (status) {
      query.status = status;
    }

    if (doctorId && req.user.role === "admin") {
      query.doctorId = doctorId;
    }

    if (
      patientId &&
      (req.user.role === "admin" || req.user.role === "doctor")
    ) {
      query.patientId = patientId;
    }

    const appointments = await Appointment.find(query)
      .populate("patientId", "name phone email")
      .populate("doctorId", "name specialization")
      .populate("clinicId", "name")
      .sort({ dateTime: 1 });

    res.json({ appointments });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create appointment
router.post(
  "/",
  [
    body("patientId").isMongoId().withMessage("Valid patient ID required"),
    body("doctorId").isMongoId().withMessage("Valid doctor ID required"),
    body("clinicId").isMongoId().withMessage("Valid clinic ID required"),
    body("dateTime").isISO8601().withMessage("Valid date time required"),
    body("type")
      .isIn(["consultation", "follow-up", "emergency", "routine"])
      .withMessage("Valid appointment type required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { patientId, doctorId, clinicId, dateTime, type, notes, symptoms } =
        req.body;

      // Check if doctor exists and is active
      const doctor = await User.findById(doctorId);
      if (!doctor || doctor.role !== "doctor" || !doctor.isActive) {
        return res.status(400).json({ message: "Invalid doctor selected" });
      }

      // Check if patient exists and is active
      const patient = await User.findById(patientId);
      if (!patient || patient.role !== "patient" || !patient.isActive) {
        return res.status(400).json({ message: "Invalid patient selected" });
      }

      // Check for conflicting appointments
      const conflictingAppointment = await Appointment.findOne({
        doctorId,
        dateTime: {
          $gte: new Date(dateTime),
          $lt: new Date(new Date(dateTime).getTime() + 30 * 60000), // 30 minutes later
        },
        status: { $in: ["scheduled", "confirmed"] },
      });

      if (conflictingAppointment) {
        return res
          .status(400)
          .json({ message: "Doctor is not available at this time" });
      }

      // Create appointment
      const appointment = new Appointment({
        patientId,
        doctorId,
        clinicId,
        dateTime: new Date(dateTime),
        type,
        notes,
        symptoms,
      });

      await appointment.save();

      // Populate the appointment for response
      await appointment.populate("patientId", "name phone email");
      await appointment.populate("doctorId", "name specialization");
      await appointment.populate("clinicId", "name");

      // Emit real-time notification
      req.io.to(doctorId).emit("new-appointment", appointment);
      req.io.to(patientId).emit("appointment-scheduled", appointment);

      res.status(201).json({
        message: "Appointment created successfully",
        appointment,
      });
    } catch (error) {
      console.error("Create appointment error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update appointment
router.put(
  "/:id",
  [
    body("status")
      .optional()
      .isIn(["scheduled", "confirmed", "cancelled", "completed", "no-show"]),
    body("dateTime").optional().isISO8601(),
    body("notes").optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { status, dateTime, notes, cancellationReason } = req.body;

      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      // Check permissions
      if (
        req.user.role === "patient" &&
        appointment.patientId.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (
        req.user.role === "doctor" &&
        appointment.doctorId.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Handle reschedule
      if (dateTime && dateTime !== appointment.dateTime.toISOString()) {
        appointment.rescheduleHistory.push({
          oldDateTime: appointment.dateTime,
          newDateTime: new Date(dateTime),
          reason: notes || "Rescheduled",
          rescheduledBy: req.user._id,
        });
        appointment.dateTime = new Date(dateTime);
      }

      // Update fields
      if (status) {
        appointment.status = status;
        if (status === "cancelled") {
          appointment.cancelledBy = req.user._id;
          appointment.cancellationReason = cancellationReason;
        }
      }

      if (notes) {
        appointment.notes = notes;
      }

      await appointment.save();

      // Populate for response
      await appointment.populate("patientId", "name phone email");
      await appointment.populate("doctorId", "name specialization");
      await appointment.populate("clinicId", "name");

      // Emit real-time notification
      req.io
        .to(appointment.patientId._id.toString())
        .emit("appointment-updated", appointment);
      req.io
        .to(appointment.doctorId._id.toString())
        .emit("appointment-updated", appointment);

      res.json({
        message: "Appointment updated successfully",
        appointment,
      });
    } catch (error) {
      console.error("Update appointment error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete appointment
router.delete("/:id", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await Appointment.findByIdAndDelete(id);

    // Emit real-time notification
    req.io
      .to(appointment.patientId.toString())
      .emit("appointment-deleted", { appointmentId: id });
    req.io
      .to(appointment.doctorId.toString())
      .emit("appointment-deleted", { appointmentId: id });

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Delete appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
