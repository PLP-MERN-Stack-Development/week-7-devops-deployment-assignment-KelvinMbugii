const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 30, // minutes
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "cancelled", "completed", "no-show"],
      default: "scheduled",
    },
    type: {
      type: String,
      enum: ["consultation", "follow-up", "emergency", "routine"],
      default: "consultation",
    },
    notes: {
      type: String,
      default: "",
    },
    symptoms: {
      type: String,
      default: "",
    },
    remindersSent: {
      twentyFourHours: {
        type: Boolean,
        default: false,
      },
      twoHours: {
        type: Boolean,
        default: false,
      },
      thirtyMinutes: {
        type: Boolean,
        default: false,
      },
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancellationReason: {
      type: String,
    },
    rescheduleHistory: [
      {
        oldDateTime: Date,
        newDateTime: Date,
        reason: String,
        rescheduledBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rescheduledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
appointmentSchema.index({ patientId: 1, dateTime: 1 });
appointmentSchema.index({ doctorId: 1, dateTime: 1 });
appointmentSchema.index({ clinicId: 1, dateTime: 1 });
appointmentSchema.index({ dateTime: 1, status: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
