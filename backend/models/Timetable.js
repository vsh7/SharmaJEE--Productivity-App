const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
});

const timetableSchema = new mongoose.Schema(
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

    tasks: [taskSchema],
  },
  { timestamps: true }
);

// Ensure one timetable per student per day
timetableSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Timetable", timetableSchema);
