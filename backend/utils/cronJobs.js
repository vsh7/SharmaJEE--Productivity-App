const cron = require("node-cron");
const User = require("../models/User");
const DailyReport = require("../models/DailyReport");
const Timetable = require("../models/Timetable");
const { sendPushNotification } = require("./pushNotifications");

function startCronJobs() {
    // Run at 2 PM IST every day - Timetable Reminder (2 PM IST = 8:30 AM UTC)
    cron.schedule("30 8 * * *", async () => {
        console.log("Running 2 PM IST timetable reminder...");

        try {
            const students = await User.find({
                role: "student",
                expoPushToken: { $ne: null },
            });

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (const student of students) {
                const timetable = await Timetable.findOne({
                    student: student._id,
                    date: today,
                });

                if (!timetable || timetable.tasks.length === 0) {
                    await sendPushNotification(
                        student.expoPushToken,
                        "📅 Timetable Reminder",
                        "Plan your study session! Create or update your timetable for today.",
                        { type: "timetable_reminder" }
                    );
                    console.log(`Timetable reminder sent to ${student.name}`);
                } else {
                    await sendPushNotification(
                        student.expoPushToken,
                        "📚 Study Time!",
                        "Check your timetable and start your study session. Stay focused!",
                        { type: "timetable_check" }
                    );
                    console.log(`Study reminder sent to ${student.name}`);
                }
            }
        } catch (error) {
            console.error("Error in timetable reminder cron:", error);
        }
    }, { timezone: "Asia/Kolkata" });

    // Run at 9 PM IST every day - Daily Report Reminder (9 PM IST = 3:30 PM UTC)
    cron.schedule("30 15 * * *", async () => {
        console.log("Running 9 PM IST daily report reminder...");

        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const students = await User.find({
                role: "student",
                expoPushToken: { $ne: null },
            });

            for (const student of students) {
                const report = await DailyReport.findOne({
                    student: student._id,
                    date: today,
                });

                if (!report) {
                    await sendPushNotification(
                        student.expoPushToken,
                        "📝 Submit Today's Work",
                        "Don't forget to submit your daily report! Track your progress and maintain your streak.",
                        { type: "daily_report_reminder" }
                    );
                    console.log(`Daily report reminder sent to ${student.name}`);
                } else {
                    await sendPushNotification(
                        student.expoPushToken,
                        "✅ Great Job!",
                        "Your daily report is submitted. Keep up the excellent work!",
                        { type: "report_confirmation" }
                    );
                    console.log(`Confirmation sent to ${student.name}`);
                }
            }
        } catch (error) {
            console.error("Error in daily report reminder cron:", error);
        }
    }, { timezone: "Asia/Kolkata" });

    console.log("✅ Cron jobs started:");
    console.log("   - Timetable reminder at 2 PM IST");
    console.log("   - Daily report reminder at 9 PM IST");
}

module.exports = { startCronJobs };
