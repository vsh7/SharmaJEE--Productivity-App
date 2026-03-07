const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
    verifyMentor,
    getAllStudentsWork,
    getAllStudentsTimetables,
    giveFeedback,
    getStudentStats,
} = require("../controllers/mentorController");

const router = express.Router();

// Base route: /api/mentor

// All mentor routes require user to be logged in AND have the 'mentor' role
router.use(protect);
router.use(verifyMentor);

// @route   GET /api/mentor/work
// @desc    Get all students' daily reports
router.get("/work", getAllStudentsWork);

// @route   GET /api/mentor/timetables
// @desc    Get all students' timetables
router.get("/timetables", getAllStudentsTimetables);

// @route   POST /api/mentor/feedback
// @desc    Submit feedback on a student's daily report
router.post("/feedback", giveFeedback);

// @route   GET /api/mentor/stats/:studentId
// @desc    Get specific student's aggregate stats (reports, timetables, feedback)
router.get("/stats/:studentId", getStudentStats);

module.exports = router;
