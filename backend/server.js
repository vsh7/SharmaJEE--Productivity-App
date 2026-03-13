require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { startCronJobs } = require("./utils/cronJobs");
const timetableRoutes = require("./routes/timetableRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// it is to connect authentication roites
app.use("/auth", require("./routes/authRoutes"));
app.use("/student/timetable", timetableRoutes);

// Daily Reports Routes
app.use("/api/reports", require("./routes/reportRoutes"));

// Feedback Routes (student viewing their feedback)
app.use("/api/feedback", require("./routes/feedbackRoutes"));

// Notification Routes
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Mentor Routes
app.use("/api/mentor", require("./routes/mentorRoutes"));

// AI Routes
app.use("/api/ai", require("./routes/aiRoutes"));

// Start cron jobs for reminders
startCronJobs();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});