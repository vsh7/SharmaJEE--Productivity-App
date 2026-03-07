const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getTodayTimetable,
  submitTimetable,
} = require("../controllers/timetableController");

router.get("/today", protect, getTodayTimetable);
router.post("/", protect, submitTimetable);

module.exports = router;
