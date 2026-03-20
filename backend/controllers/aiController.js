const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getStudentAnalytics } = require("../services/analyticsService");
const User = require("../models/User");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate AI Study Suggestions
 */
const generateAISuggestions = async (req, res) => {
    try {
        const studentId = req.user.id;

        // 1. Get student info
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // 2. Get student analytics
        const analytics = await getStudentAnalytics(studentId);

        if (analytics.totalDays === 0) {
            return res.status(200).json({
                message: "Not enough data yet. Submit a few daily reports first!",
                suggestions: [],
                analytics: null,
            });
        }

        // 3. Prepare prompt for AI
        const prompt = createPrompt(student, analytics);

        // 4. Call Gemini AI
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiText = response.text();

        // 5. Parse AI response into structured suggestions
        const suggestions = parseAISuggestions(aiText);

        const aiResponse = {
            message: "AI suggestions generated successfully",
            suggestions,
            analytics: {
                totalDays: analytics.totalDays,
                consistency: analytics.consistency,
                patterns: analytics.patterns,
                subjectStats: analytics.subjectStats,
            }
        };

        // Only include raw AI output in development mode
        if (process.env.NODE_ENV === 'development') {
            aiResponse.rawAI = aiText;
        }

        return res.status(200).json(aiResponse);

    } catch (error) {
        console.error("AI Suggestion Error:", error);
        return res.status(500).json({
            message: "Failed to generate suggestions",
            error: error.message
        });
    }
};

/**
 * Create AI prompt from student data
 */
const createPrompt = (student, analytics) => {
    const { patterns, subjectStats, consistency, totalDays } = analytics;

    return `You are an expert study advisor for JEE/NEET students. Analyze this student's data and provide 5-7 specific, actionable study suggestions.

STUDENT DATA:
- Name: ${student.name}
- Days Tracked: ${totalDays} days
- Consistency: ${consistency.message} (${consistency.score}% - ${consistency.daysReported}/7 days last week)
- Average Total Hours: ${patterns.avgTotalHours} hours/day
- Most Studied: ${patterns.mostStudied.subject} (${patterns.mostStudied.hours.toFixed(1)} hours total)
- Least Studied: ${patterns.leastStudied.subject} (${patterns.leastStudied.hours.toFixed(1)} hours total)

SUBJECT BREAKDOWN:
- Physics: ${subjectStats.physics.avgHours} hrs/day (${subjectStats.physics.days} days studied)
- Chemistry: ${subjectStats.chemistry.avgHours} hrs/day (${subjectStats.chemistry.days} days studied)
- Math: ${subjectStats.math.avgHours} hrs/day (${subjectStats.math.days} days studied)
- Biology: ${subjectStats.biology.avgHours} hrs/day (${subjectStats.biology.days} days studied)

Provide suggestions in this exact format:
1. [CATEGORY] Specific actionable suggestion
2. [CATEGORY] Specific actionable suggestion
...

Categories: TIME_MANAGEMENT, SUBJECT_BALANCE, CONSISTENCY, PRODUCTIVITY, EXAM_PREP, BREAKS

Keep suggestions:
- Specific and actionable
- Based on actual data patterns
- Realistic for a JEE/NEET student
- Encouraging but honest`;
};

/**
 * Parse AI response into structured format
 */
const parseAISuggestions = (aiText) => {
    const lines = aiText.split('\n').filter(line => line.trim());
    const suggestions = [];

    lines.forEach(line => {
        // Match format: "1. [CATEGORY] suggestion text"
        const match = line.match(/^\d+\.\s*\[([A-Z_]+)\]\s*(.+)$/);
        if (match) {
            suggestions.push({
                category: match[1],
                text: match[2].trim(),
            });
        }
    });

    // If parsing failed, create basic suggestions
    if (suggestions.length === 0) {
        return [{
            category: "GENERAL",
            text: aiText.substring(0, 200) + "...",
        }];
    }

    return suggestions;
};

/**
 * Get Quick Stats (for dashboard widget)
 */
const getQuickStats = async (req, res) => {
    try {
        const studentId = req.user.id;
        const analytics = await getStudentAnalytics(studentId);

        return res.status(200).json({
            consistency: analytics.consistency,
            avgHours: analytics.patterns.avgTotalHours || 0,
            totalDays: analytics.totalDays,
            mostStudied: analytics.patterns.mostStudied?.subject || "N/A",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generateAISuggestions,
    getQuickStats,
};
