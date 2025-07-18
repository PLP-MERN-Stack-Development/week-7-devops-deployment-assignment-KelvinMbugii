const express = require("express");
const User = require("../models/User");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

// Get all users (admin only)
router.get("/", requireRole(["admin"]), async (req, res) => {
  try {
    const { role, clinicId, search } = req.query;
    let query = {};

    if (role) {
      query.role = role;
    }

    if (clinicId) {
      query.clinicId = clinicId;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).populate("clinicId", "name");
    res.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get doctors
router.get("/doctors", async (req, res) => {
  try {
    const { clinicId } = req.query;
    let query = { role: "doctor", isActive: true };

    if (clinicId) {
      query.clinicId = clinicId;
    }

    const doctors = await User.find(query)
      .select("name specialization clinicId")
      .populate("clinicId", "name");

    res.json({ doctors });
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get patients
router.get("/patients", requireRole(["admin", "doctor"]), async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: "patient", isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const patients = await User.find(query)
      .select("name email phone createdAt")
      .sort({ createdAt: -1 });

    res.json({ patients });
  } catch (error) {
    console.error("Get patients error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user
router.put("/:id", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, specialization, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (specialization) user.specialization = specialization;
    if (typeof isActive === "boolean") user.isActive = isActive;

    await user.save();

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/:id", requireRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
