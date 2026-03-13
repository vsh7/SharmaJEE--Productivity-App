const DailyReport = require("../models/DailyReport");
const PerformanceMetric = require("../models/PerformanceMetric");

/**
 * Get student analytics for AI suggestions
 * Aggregates last 30 days of data
 */
const getStudentAnalytics = async (studentId) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // 1. Get daily reports from last 30 days
        const reports = await DailyReport.find({
            student: studentId,
            date: { $gte: thirtyDaysAgo }
        }).sort({ date: -1 });

        // 2. Get performance metrics
        const performances = await PerformanceMetric.find({
            student: studentId,
            date: { $gte: thirtyDaysAgo }
        }).sort({ date: -1 });

        // 3. Calculate subject-wise statistics
        const subjectStats = calculateSubjectStats(reports);

        // 4. Identify patterns
        const patterns = identifyPatterns(reports);

        // 5. Calculate consistency
        const consistency = calculateConsistency(reports);

        return {
            reports,
            performances,
            subjectStats,
            patterns,
            consistency,
            totalDays: reports.length,
        };
    } catch (error) {
        throw new Error(`Analytics error: ${error.message}`);
    }
};

/**
 * Calculate subject-wise statistics
 */
const calculateSubjectStats = (reports) => {
    const stats = {
        physics: { totalHours: 0, avgHours: 0, days: 0 },
        chemistry: { totalHours: 0, avgHours: 0, days: 0 },
        math: { totalHours: 0, avgHours: 0, days: 0 },
        biology: { totalHours: 0, avgHours: 0, days: 0 },
    };

    reports.forEach(report => {
        ['physics', 'chemistry', 'math', 'biology'].forEach(subject => {
            const hours = report.hours[subject] || 0;
            if (hours > 0) {
                stats[subject].totalHours += hours;
                stats[subject].days += 1;
            }
        });
    });

    // Calculate averages
    Object.keys(stats).forEach(subject => {
        if (stats[subject].days > 0) {
            stats[subject].avgHours = (stats[subject].totalHours / stats[subject].days).toFixed(2);
        }
    });

    return stats;
};

/**
 * Identify study patterns
 */
const identifyPatterns = (reports) => {
    if (reports.length === 0) return {};

    // Calculate average total hours
    const totalHoursSum = reports.reduce((sum, r) => sum + r.totalHours, 0);
    const avgTotalHours = (totalHoursSum / reports.length).toFixed(2);

    // Find most/least studied subjects
    const subjectHours = { physics: 0, chemistry: 0, math: 0, biology: 0 };
    reports.forEach(report => {
        Object.keys(subjectHours).forEach(subject => {
            subjectHours[subject] += report.hours[subject] || 0;
        });
    });

    const sortedSubjects = Object.entries(subjectHours)
        .sort((a, b) => b[1] - a[1])
        .map(([subject, hours]) => ({ subject, hours }));

    return {
        avgTotalHours: parseFloat(avgTotalHours),
        mostStudied: sortedSubjects[0],
        leastStudied: sortedSubjects[sortedSubjects.length - 1],
        subjectDistribution: subjectHours,
    };
};

/**
 * Calculate study consistency
 */
const calculateConsistency = (reports) => {
    if (reports.length === 0) return { score: 0, message: "No data" };

    const last7Days = reports.slice(0, 7);
    const consistencyScore = (last7Days.length / 7) * 100;

    let message = "";
    if (consistencyScore >= 90) message = "Excellent";
    else if (consistencyScore >= 70) message = "Good";
    else if (consistencyScore >= 50) message = "Fair";
    else message = "Needs improvement";

    return {
        score: consistencyScore.toFixed(0),
        message,
        daysReported: last7Days.length,
        totalDays: 7,
    };
};

module.exports = {
    getStudentAnalytics,
};
