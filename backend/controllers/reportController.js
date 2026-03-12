const DailyReport = require("../models/DailyReport");

/* ===============================
   SUBMIT / UPDATE DAILY REPORT
   =============================== */
const submitDailyReport = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { date, hours, totalHours, tasksCompleted, notes } = req.body;

        // Validation: Check each subject's hours
        const subjects = ['physics', 'chemistry', 'math', 'biology'];
        for (const subject of subjects) {
            const subjectHours = parseFloat(hours[subject]) || 0;
            if (subjectHours > 24) {
                return res.status(400).json({
                    message: `${subject.charAt(0).toUpperCase() + subject.slice(1)} cannot exceed 24 hours per day!`
                });
            }
            if (subjectHours < 0) {
                return res.status(400).json({
                    message: `${subject.charAt(0).toUpperCase() + subject.slice(1)} cannot be negative!`
                });
            }
        }

        // Validation: Check total hours
        if (totalHours > 24) {
            return res.status(400).json({
                message: "Total study hours cannot exceed 24 hours per day!"
            });
        }

        if (totalHours < 0) {
            return res.status(400).json({
                message: "Total hours cannot be negative!"
            });
        }

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
