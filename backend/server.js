require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const timetableRoutes = require("./routes/timetableRoutes");

const app = express();


app.use(express.json());


connectDB();

// it is to connect authentication roites
app.use("/auth", require("./routes/authRoutes"));
app.use("/student/timetable", timetableRoutes);

// Daily Reports Routes
app.use("/api/reports", require("./routes/reportRoutes"));

// Mentor Routes
app.use("/api/mentor", require("./routes/mentorRoutes"));
app.listen(3000, () => {
  console.log("Server running on port 3000");
});