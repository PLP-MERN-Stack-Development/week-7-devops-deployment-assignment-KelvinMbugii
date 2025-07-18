const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Clinic = require("../models/Clinic");
const Notification = require("../models/Notification");

class ReminderService {
  constructor(notificationService) {
    this.notificationService = notificationService;
  }

  async checkAndSendReminders() {
    try {
      const now = new Date();
      const twentyFourHoursLater = new Date(
        now.getTime() + 24 * 60 * 60 * 1000
      );
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);

      // Get upcoming appointments
      const appointments = await Appointment.find({
        status: { $in: ["scheduled", "confirmed"] },
        dateTime: { $gte: now, $lte: twentyFourHoursLater },
      })
        .populate("patientId")
        .populate("doctorId")
        .populate("clinicId");

      for (const appointment of appointments) {
        const appointmentTime = new Date(appointment.dateTime);
        const clinic = appointment.clinicId;

        // Check 24-hour reminder
        if (
          this.isWithinTimeRange(appointmentTime, twentyFourHoursLater, 15) &&
          !appointment.remindersSent.twentyFourHours
        ) {
          await this.sendAppointmentReminder(appointment, "24-hour", clinic);
          appointment.remindersSent.twentyFourHours = true;
          await appointment.save();
        }

        // Check 2-hour reminder
        if (
          this.isWithinTimeRange(appointmentTime, twoHoursLater, 15) &&
          !appointment.remindersSent.twoHours
        ) {
          await this.sendAppointmentReminder(appointment, "2-hour", clinic);
          appointment.remindersSent.twoHours = true;
          await appointment.save();
        }

        // Check 30-minute reminder
        if (
          this.isWithinTimeRange(appointmentTime, thirtyMinutesLater, 15) &&
          !appointment.remindersSent.thirtyMinutes
        ) {
          await this.sendAppointmentReminder(appointment, "30-minute", clinic);
          appointment.remindersSent.thirtyMinutes = true;
          await appointment.save();
        }
      }

      console.log(
        `Processed ${appointments.length} appointments for reminders`
      );
    } catch (error) {
      console.error("Reminder check error:", error);
    }
  }

  isWithinTimeRange(appointmentTime, targetTime, toleranceMinutes) {
    const timeDiff = Math.abs(appointmentTime.getTime() - targetTime.getTime());
    const toleranceMs = toleranceMinutes * 60 * 1000;
    return timeDiff <= toleranceMs;
  }

  async sendAppointmentReminder(appointment, reminderType, clinic) {
    try {
      const patient = appointment.patientId;
      const doctor = appointment.doctorId;
      const appointmentDate = new Date(appointment.dateTime);

      const formattedDate = appointmentDate.toLocaleDateString();
      const formattedTime = appointmentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Patient reminder message
      const patientMessage = `
        Reminder: You have an appointment scheduled for ${formattedDate} at ${formattedTime}
        Doctor: ${doctor.name}
        Clinic: ${clinic.name}
        Type: ${appointment.type}
        ${appointment.notes ? `Notes: ${appointment.notes}` : ""}
        
        Please arrive 15 minutes early. If you need to reschedule, please contact us as soon as possible.
      `.trim();

      // Doctor reminder message
      const doctorMessage = `
        Reminder: You have an appointment scheduled for ${formattedDate} at ${formattedTime}
        Patient: ${patient.name}
        Phone: ${patient.phone}
        Type: ${appointment.type}
        ${appointment.symptoms ? `Symptoms: ${appointment.symptoms}` : ""}
        ${appointment.notes ? `Notes: ${appointment.notes}` : ""}
      `.trim();

      // Send notifications based on preferences and clinic settings
      const settings = clinic.settings.reminderSettings;

      // Send to patient
      if (patient.notificationPreferences.sms && settings.sms.enabled) {
        await this.notificationService.sendNotification(
          patient._id,
          "appointment-reminder",
          patientMessage,
          "sms",
          appointment._id
        );
      }

      if (
        patient.notificationPreferences.whatsapp &&
        settings.whatsapp.enabled
      ) {
        await this.notificationService.sendNotification(
          patient._id,
          "appointment-reminder",
          patientMessage,
          "whatsapp",
          appointment._id
        );
      }

      if (patient.notificationPreferences.email && settings.email.enabled) {
        await this.notificationService.sendNotification(
          patient._id,
          "appointment-reminder",
          patientMessage,
          "email",
          appointment._id
        );
      }

      // Send to doctor
      await this.notificationService.sendNotification(
        doctor._id,
        "appointment-reminder",
        doctorMessage,
        "push",
        appointment._id
      );

      console.log(
        `Sent ${reminderType} reminder for appointment ${appointment._id}`
      );
    } catch (error) {
      console.error("Send reminder error:", error);
    }
  }

  async cleanupOldNotifications() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
      });

      console.log(`Cleaned up ${result.deletedCount} old notifications`);
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }
}

module.exports = ReminderService;
