const DailyReport = require("../models/DailyReport");
const Timetable = require("../models/Timetable");
const Feedback = require("../models/Feedback");

/* ===============================
   VERIFY MENTOR
   =============================== */
const verifyMentor = (req, res, next) => {
    if (req.user.role !== "mentor") {
        return res.status(403).json({ message: "Access denied. Mentors only." });
    }
    next();
};

/* ===============================
   GET ALL STUDENTS WORK (Reports)
   =============================== */
const getAllStudentsWork = async (req, res) => {
    try {
        const { date } = req.query; // Expecting YYYY-MM-DD

        let query = {};
        if (date) {
            const normalizedDate = new Date(date);
            normalizedDate.setHours(0, 0, 0, 0);
            query.date = normalizedDate;
        }

        const reports = await DailyReport.find(query)
            .populate("student", "name email")
            .sort({ date: -1 });

        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/* ===============================
   GET ALL STUDENTS TIMETABLES
   =============================== */
const getAllStudentsTimetables = async (req, res) => {
    try {
        const { date } = req.query;

        let query = {};
        if (date) {
            const normalizedDate = new Date(date);
            normalizedDate.setHours(0, 0, 0, 0);
            query.date = normalizedDate;
        }

        const timetables = await Timetable.find(query)
            .populate("student", "name email")
            .sort({ date: -1 });

        return res.status(200).json(timetables);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/* ===============================
   GIVE FEEDBACK
   =============================== */
const giveFeedback = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const { studentId, dailyReportId, comments } = req.body;

        const feedback = await Feedback.create({
            mentor: mentorId,
            student: studentId,
            dailyReport: dailyReportId,
            comments,
        });

        return res.status(201).json({
            message: "Feedback submitted successfully",
            feedback,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/* ===============================
   GET SPECIFIC STUDENT STATS
   =============================== */
const getStudentStats = async (req, res) => {
    try {
        const { studentId } = req.params;

        const reports = await DailyReport.find({ student: studentId }).sort({ date: -1 });
        const timetables = await Timetable.find({ student: studentId }).sort({ date: -1 });
        const feedback = await Feedback.find({ student: studentId })
            .populate("mentor", "name")
            .populate("dailyReport")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            reports,
            timetables,
            feedback
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    verifyMentor,
    getAllStudentsWork,
    getAllStudentsTimetables,
    giveFeedback,
    getStudentStats,
};
