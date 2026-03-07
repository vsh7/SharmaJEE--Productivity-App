const Timetable = require("../models/Timetable");

/* ===============================
   GET TODAY'S TIMETABLE
   =============================== */
const getTodayTimetable = async (req, res) => {
  try {
    const studentId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const timetable = await Timetable.findOne({
      student: studentId,
      date: today,
    });

    if (!timetable) {
      return res.status(200).json({
        date: today,
        tasks: [],
      });
    }

    return res.status(200).json(timetable);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ===============================
   CREATE / UPDATE TIMETABLE
   =============================== */
const submitTimetable = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { date, tasks } = req.body;

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const timetable = await Timetable.findOneAndUpdate(
      { student: studentId, date: normalizedDate },
      { tasks },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Timetable saved successfully",
      timetable,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTodayTimetable,
  submitTimetable,
};
