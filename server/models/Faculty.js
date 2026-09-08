const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    facultyId: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    designation: {
      type: String,
      default: ""
    },

    qualification: {
      type: String,
      default: ""
    },

    experience: {
      type: Number,
      default: 0
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phone: {
      type: String,
      default: ""
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      default: "faculty"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Faculty", facultySchema);