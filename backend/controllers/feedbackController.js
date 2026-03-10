const Feedback = require("../models/Feedback");

const getMyFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ student: req.user.id })
            .populate("mentor", "name")
            .populate("dailyReport", "date hours tasksCompleted")
            .sort({ createdAt: -1 });

        res.status(200).json(feedback);
    } catch (error) {
        console.error("Error fetching student feedback:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getMyFeedback };
