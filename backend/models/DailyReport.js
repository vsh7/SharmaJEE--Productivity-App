const mongoose = require("mongoose");

const DailyReportSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        hours: {
            physics: { type: Number, default: 0 },
            chemistry: { type: Number, default: 0 },
            math: { type: Number, default: 0 },
            biology: { type: Number, default: 0 },
        },
        totalHours: {
            type: Number,
            default: 0,
        },
        tasksCompleted: {
            type: String,
            default: "",
        },
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("DailyReport", DailyReportSchema);
