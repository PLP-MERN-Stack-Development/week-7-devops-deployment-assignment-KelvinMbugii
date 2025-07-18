const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    type: {
      type: String,
      enum: [
        "appointment-reminder",
        "appointment-confirmation",
        "appointment-cancellation",
        "appointment-reschedule",
        "system-notification",
      ],
      required: true,
    },
    channel: {
      type: String,
      enum: ["sms", "whatsapp", "email", "push"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    subject: {
      type: String, // for email notifications
    },
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed"],
      default: "pending",
    },
    sentAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    errorMessage: {
      type: String,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    maxRetries: {
      type: Number,
      default: 3,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ status: 1, createdAt: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
