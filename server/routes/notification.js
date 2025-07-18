const express = require("express");
const Notification = require("../models/Notification");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

// Get notifications
router.get("/", async (req, res) => {
  try {
    const { type, status, limit = 50 } = req.query;
    let query = {};

    if (req.user.role !== "admin") {
      query.recipientId = req.user._id;
    }

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    const notifications = await Notification.find(query)
      .populate("recipientId", "name email")
      .populate("appointmentId", "dateTime status")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Check if user owns this notification
    if (notification.recipientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.status = "delivered";
    notification.deliveredAt = new Date();
    await notification.save();

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
