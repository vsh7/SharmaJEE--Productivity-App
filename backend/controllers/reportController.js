const DailyReport = require("../models/DailyReport");

/* ===============================
   SUBMIT / UPDATE DAILY REPORT
   =============================== */
const submitDailyReport = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { date, hours, totalHours, tasksCompleted, notes } = req.body;

        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        const report = await DailyReport.findOneAndUpdate(
            { student: studentId, date: normalizedDate },
            { hours, totalHours, tasksCompleted, notes },
            { new: true, upsert: true } // If it doesn't exist, create it. If it does, update it.
        );

        return res.status(200).json({
            message: "Daily report saved successfully",
            report,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/* ===============================
   GET TODAY'S DAILY REPORT
   =============================== */
const getTodayReport = async (req, res) => {
    try {
        const studentId = req.user.id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const report = await DailyReport.findOne({
            student: studentId,
            date: today,
        });

        if (!report) {
            // Return empty default state if not found
            return res.status(200).json({
                date: today,
                hours: { physics: 0, chemistry: 0, math: 0, biology: 0 },
                totalHours: 0,
                tasksCompleted: "",
                notes: "",
            });
        }

        return res.status(200).json(report);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/* ===============================
   GET PAST DAILY REPORTS
   =============================== */
const getPastReports = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Fetch all reports except today's (optional filter) and sort by date descending
        const reports = await DailyReport.find({ student: studentId })
            .sort({ date: -1 });

        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitDailyReport,
    getTodayReport,
    getPastReports,
};
