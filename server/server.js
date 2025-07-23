const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const cron = require("node-cron");

// Import routes
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointment");
const userRoutes = require("./routes/users");
const clinicRoutes = require("./routes/clinics");
const notificationRoutes = require("./routes/notification");

// Import middleware
const errorHandler = require("./middleware/errorHandler");
const { authenticateToken } = require("./middleware/auth");

// Import services
const NotificationService = require("./services/notificationService");
const ReminderService = require("./services/reminderService");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://medicare-theta-dusky.vercel.app/",
];

// Middleware
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    },
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "content-Type, Authorization",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", authenticateToken, appointmentRoutes);
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/clinics", authenticateToken, clinicRoutes);
app.use("/api/notifications", authenticateToken, notificationRoutes);

// Error handling middleware
app.use(errorHandler);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb://localhost:27017/medical-appointment-system",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize services
const notificationService = new NotificationService(io);
const reminderService = new ReminderService(notificationService);

// Schedule reminder jobs
// Check for reminders every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  console.log("Running scheduled reminder check...");
  await reminderService.checkAndSendReminders();
});

// Daily cleanup job at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily cleanup...");
  await reminderService.cleanupOldNotifications();
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
