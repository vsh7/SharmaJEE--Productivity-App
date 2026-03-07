const mongoose = require("mongoose");

const FeedbackSchema = mongoose.Schema(
    {
        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        dailyReport: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DailyReport",
            required: true,
        },
        comments: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
