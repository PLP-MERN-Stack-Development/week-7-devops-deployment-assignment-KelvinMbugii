const express = require("express");
const Clinic = require("../models/Clinic");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

// Get all clinics
router.get("/", async (req, res) => {
  try {
    const clinics = await Clinic.find({ isActive: true })
      .populate("adminId", "name email")
      .populate("doctors", "name specialization");

    res.json({ clinics });
  } catch (error) {
    console.error("Get clinics error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create clinic
router.post("/", requireRole(["admin"]), async (req, res) => {
  try {
    const { name, address, phone, email, settings } = req.body;

    const clinic = new Clinic({
      name,
      address,
      phone,
      email,
      adminId: req.user._id,
      settings,
    });

    await clinic.save();

    res.status(201).json({
      message: "Clinic created successfully",
      clinic,
    });
  } catch (error) {
    console.error("Create clinic error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update clinic
router.put("/:id", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const clinic = await Clinic.findById(id);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    // Check if user is the admin of this clinic
    if (clinic.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(clinic, updates);
    await clinic.save();

    res.json({
      message: "Clinic updated successfully",
      clinic,
    });
  } catch (error) {
    console.error("Update clinic error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
