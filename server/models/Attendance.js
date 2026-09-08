const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    department: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    faculty: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance for same student,
// subject and date
attendanceSchema.index(
  {
    student: 1,
    subject: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);