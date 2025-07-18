const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    settings: {
      workingHours: {
        monday: { start: String, end: String, isOpen: Boolean },
        tuesday: { start: String, end: String, isOpen: Boolean },
        wednesday: { start: String, end: String, isOpen: Boolean },
        thursday: { start: String, end: String, isOpen: Boolean },
        friday: { start: String, end: String, isOpen: Boolean },
        saturday: { start: String, end: String, isOpen: Boolean },
        sunday: { start: String, end: String, isOpen: Boolean },
      },
      appointmentDuration: {
        type: Number,
        default: 30,
      },
      reminderSettings: {
        sms: {
          enabled: { type: Boolean, default: true },
          twentyFourHours: { type: Boolean, default: true },
          twoHours: { type: Boolean, default: true },
          thirtyMinutes: { type: Boolean, default: true },
        },
        whatsapp: {
          enabled: { type: Boolean, default: true },
          twentyFourHours: { type: Boolean, default: true },
          twoHours: { type: Boolean, default: true },
          thirtyMinutes: { type: Boolean, default: true },
        },
        email: {
          enabled: { type: Boolean, default: true },
          twentyFourHours: { type: Boolean, default: true },
          twoHours: { type: Boolean, default: true },
          thirtyMinutes: { type: Boolean, default: false },
        },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Clinic", clinicSchema);
