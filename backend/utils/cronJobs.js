const cron = require("node-cron");
const User = require("../models/User");
const DailyReport = require("../models/DailyReport");
const { sendPushNotification } = require("./pushNotifications");

function startCronJobs() {
    // Run at 9 PM IST every day (IST = UTC+5:30, so 9 PM IST = 3:30 PM UTC)
    cron.schedule("30 15 * * *", async () => {
        console.log("Running 9 PM IST daily report reminder check...");

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
                        "Daily Report Reminder",
                        "You haven't submitted your daily report yet. Don't break your streak!",
                        { type: "reminder" }
                    );
                    console.log(`Reminder sent to ${student.name}`);
                }
            }
        } catch (error) {
            console.error("Error in daily reminder cron:", error);
        }
    }, { timezone: "Asia/Kolkata" });

    console.log("Cron jobs started: daily report reminder at 9 PM IST");
}

module.exports = { startCronJobs };
