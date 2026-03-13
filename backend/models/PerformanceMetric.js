const mongoose = require("mongoose");

const PerformanceMetricSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subject: {
            type: String,
            enum: ['physics', 'chemistry', 'math', 'biology'],
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        // Quiz/Test scores (0-100)
        score: {
            type: Number,
            min: 0,
            max: 100,
        },
        // Time spent studying this subject (hours)
        timeSpent: {
            type: Number,
            default: 0,
        },
        // Topics covered
        topicsCovered: {
            type: String,
            default: "",
        },
        // Difficulty level felt by student
        difficultyLevel: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
        },
        // Notes about performance
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Index for faster queries
PerformanceMetricSchema.index({ student: 1, date: -1 });
PerformanceMetricSchema.index({ student: 1, subject: 1 });

module.exports = mongoose.model("PerformanceMetric", PerformanceMetricSchema);
