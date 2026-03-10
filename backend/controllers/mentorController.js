const User = require("../models/User");
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

        // Send push notification to student
        const student = await User.findById(studentId);
        if (student && student.expoPushToken) {
            const { sendPushNotification } = require("../utils/pushNotifications");
            sendPushNotification(
                student.expoPushToken,
                "New Mentor Feedback",
                "Your mentor has reviewed your daily report. Tap to see feedback.",
                { type: "feedback", feedbackId: String(feedback._id) }
            );
        }

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

        const student = await User.findById(studentId).select("name email");
        const reports = await DailyReport.find({ student: studentId }).sort({ date: -1 });
        const timetables = await Timetable.find({ student: studentId }).sort({ date: -1 });
        const feedback = await Feedback.find({ student: studentId })
            .populate("mentor", "name")
            .populate("dailyReport")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            student,
            reports,
            timetables,
            feedback
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/* ===============================
   GET MENTOR OVERVIEW STATS
   =============================== */
const getMentorOverview = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeStudents = await User.countDocuments({ role: "student" });
        const reportsToday = await DailyReport.countDocuments({ date: today });
        const timetablesToday = await Timetable.countDocuments({ date: today });

        const allReportsToday = await DailyReport.find({ date: today }).select("_id");
        const reportIds = allReportsToday.map(r => r._id);
        const feedbackCount = await Feedback.countDocuments({ dailyReport: { $in: reportIds } });
        const pendingFeedback = Math.max(0, reportIds.length - feedbackCount);

        return res.status(200).json({
            activeStudents,
            reportsToday,
            pendingFeedback,
            timetablesToday,
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
    getMentorOverview,
};
