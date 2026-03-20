const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { timetableValidation } = require("../middleware/validation");
const {
  getTodayTimetable,
  submitTimetable,
  getPastTimetables,
} = require("../controllers/timetableController");

router.get("/today", protect, getTodayTimetable);
router.get("/history", protect, getPastTimetables);
router.post("/", protect, timetableValidation, submitTimetable);

module.exports = router;
