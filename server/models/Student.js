const mongoose = require("mongoose");


// =====================================================
// STUDENT SCHEMA
// =====================================================

const studentSchema = new mongoose.Schema(
    {

        rollNumber: {
            type: Number,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        department: {
            type: String,
            trim: true
        },

        semester: {
            type: Number
        },

        phone: {
            type: String,
            trim: true
        },

        address: {
            type: String,
            trim: true
        }

    },
    {
        timestamps: true
    }
);


// =====================================================
// EXPORT MODEL
// =====================================================

// IMPORTANT:
// Prevent OverwriteModelError

const Student =
    mongoose.models.Student ||
    mongoose.model("Student", studentSchema);


module.exports = Student;