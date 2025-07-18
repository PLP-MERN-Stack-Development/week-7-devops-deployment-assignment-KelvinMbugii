const twilio = require("twilio");
const nodemailer = require("nodemailer");
const Notification = require("../models/Notification");
const User = require("../models/User");

class NotificationService {
  constructor(io) {
    this.io = io;
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    this.emailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendNotification(
    recipientId,
    type,
    message,
    channel = "push",
    appointmentId = null
  ) {
    try {
      const notification = new Notification({
        recipientId,
        type,
        message,
        channel,
        appointmentId,
      });

      await notification.save();

      const user = await User.findById(recipientId);
      if (!user) {
        throw new Error("User not found");
      }

      switch (channel) {
        case "sms":
          await this.sendSMS(user.phone, message, notification._id);
          break;
        case "whatsapp":
          await this.sendWhatsApp(user.phone, message, notification._id);
          break;
        case "email":
          await this.sendEmail(
            user.email,
            `Medical Appointment Reminder`,
            message,
            notification._id
          );
          break;
        case "push":
          await this.sendPushNotification(
            recipientId,
            message,
            notification._id
          );
          break;
      }

      return notification;
    } catch (error) {
      console.error("Notification send error:", error);
      throw error;
    }
  }

  async sendSMS(phone, message, notificationId) {
    try {
      await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });

      await this.updateNotificationStatus(notificationId, "sent");
    } catch (error) {
      console.error("SMS send error:", error);
      await this.updateNotificationStatus(
        notificationId,
        "failed",
        error.message
      );
    }
  }

  async sendWhatsApp(phone, message, notificationId) {
    try {
      await this.twilioClient.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${phone}`,
      });

      await this.updateNotificationStatus(notificationId, "sent");
    } catch (error) {
      console.error("WhatsApp send error:", error);
      await this.updateNotificationStatus(
        notificationId,
        "failed",
        error.message
      );
    }
  }

  async sendEmail(email, subject, message, notificationId) {
    try {
      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Medical Appointment Reminder</h2>
            <p>${message}</p>
            <footer style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280;">
              <p>This is an automated message from MediCare System.</p>
            </footer>
          </div>
        `,
      });

      await this.updateNotificationStatus(notificationId, "sent");
    } catch (error) {
      console.error("Email send error:", error);
      await this.updateNotificationStatus(
        notificationId,
        "failed",
        error.message
      );
    }
  }

  async sendPushNotification(recipientId, message, notificationId) {
    try {
      // Send real-time notification via Socket.io
      this.io.to(recipientId).emit("notification", {
        id: notificationId,
        message,
        timestamp: new Date(),
      });

      await this.updateNotificationStatus(notificationId, "sent");
    } catch (error) {
      console.error("Push notification send error:", error);
      await this.updateNotificationStatus(
        notificationId,
        "failed",
        error.message
      );
    }
  }

  async updateNotificationStatus(notificationId, status, errorMessage = null) {
    try {
      const updateData = {
        status,
        sentAt: new Date(),
      };

      if (errorMessage) {
        updateData.errorMessage = errorMessage;
      }

      await Notification.findByIdAndUpdate(notificationId, updateData);
    } catch (error) {
      console.error("Update notification status error:", error);
    }
  }
}

module.exports = NotificationService;
