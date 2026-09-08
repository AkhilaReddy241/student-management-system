const mongoose = require("mongoose");

const internalSchema = new mongoose.Schema(
  {
    examMarks: {
      type: Number,
      required: true,
      min: 0,
      max: 25
    },

    assignmentMarks: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    }
  },
  {
    _id: false
  }
);

const marksSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    semester: {
      type: Number,
      required: true
    },

    // Subject code such as AOR608
    subjectId: {
      type: String,
      trim: true
    },

    subject: {
      type: String,
      required: true,
      trim: true
    },

    internal1: {
      type: internalSchema,
      default: null
    },

    internal2: {
      type: internalSchema,
      default: null
    },

    externalMarks: {
      type: Number,
      min: 0,
      max: 70,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Marks =
  mongoose.models.Marks ||
  mongoose.model("Marks", marksSchema);

module.exports = Marks;