const express = require("express");
const protect = require("../middleware/authMiddleware");
const { reportValidation } = require("../middleware/validation");
const {
    submitDailyReport,
    getTodayReport,
    getPastReports
} = require("../controllers/reportController");

const router = express.Router();

// Base route: /api/reports

// @route   POST /api/reports/submit
// @desc    Submit or update today's daily report
// @access  Private (Student)
router.post("/submit", protect, reportValidation, submitDailyReport);

// @route   GET /api/reports/today
// @desc    Get today's daily report
// @access  Private (Student)
router.get("/today", protect, getTodayReport);

// @route   GET /api/reports/history
// @desc    Get all past daily reports
// @access  Private (Student)
router.get("/history", protect, getPastReports);

module.exports = router;
