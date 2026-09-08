const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    subjectName: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
    },

   semester: {
  type: Number,
  required: true,
  min: 1,
  max: 8,
},
    credits: {
      type: Number,
      required: true,
    },

    faculty: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subject", subjectSchema);