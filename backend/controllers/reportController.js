const DailyReport = require("../models/DailyReport");

/* ===============================
   SUBMIT / UPDATE DAILY REPORT
   =============================== */
const submitDailyReport = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { date, timeSlots, notes } = req.body;

        let hours = { physics: 0, chemistry: 0, math: 0, biology: 0 };
        let totalHours = 0;
        let tasksCompletedArray = [];

        if (timeSlots && Array.isArray(timeSlots)) {
            timeSlots.forEach(slot => {
                // Expected format HH:MM
                const [startH, startM] = (slot.startTime || "00:00").split(':').map(Number);
                const [endH, endM] = (slot.endTime || "00:00").split(':').map(Number);
                
                if (!isNaN(startH) && !isNaN(startM) && !isNaN(endH) && !isNaN(endM)) {
                    let duration = (endH + endM / 60) - (startH + startM / 60);
                    if (duration < 0) duration += 24; // Handle over midnight if any
                    
                    if (slot.subject && hours[slot.subject] !== undefined) {
                        hours[slot.subject] += duration;
                        totalHours += duration;
                    }
                }
                
                if (slot.taskDescription && slot.taskDescription.trim() !== '') {
                    tasksCompletedArray.push(slot.taskDescription.trim());
                }
            });
        }
        
        const tasksCompleted = tasksCompletedArray.join(', ');

        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        const report = await DailyReport.findOneAndUpdate(
            { student: studentId, date: normalizedDate },
            { timeSlots, hours, totalHours, tasksCompleted, notes },
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
                timeSlots: [],
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
