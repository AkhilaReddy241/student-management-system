const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const Faculty = require("../models/Faculty");
const Student = require("../models/Student");


// ======================================================
// ADMIN LOGIN
// ======================================================

const adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        console.log("Admin Login:", email);

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        }

        const admin = await Admin.findOne({
            email: email.toLowerCase()
        });

        if (!admin) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                admin.password
            );

        if (!isPasswordCorrect) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        const token = jwt.sign(
            {
                id: admin._id,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({

            success: true,

            message: "Admin login successful",

            token,

            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: "admin"
            }

        });

    } catch (error) {

        console.log(
            "ADMIN LOGIN ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ======================================================
// FACULTY LOGIN
// ======================================================

const facultyLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        console.log("Faculty Login:", email);

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        }

        const faculty = await Faculty.findOne({
            email: email.toLowerCase()
        });

        if (!faculty) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                faculty.password
            );

        if (!isPasswordCorrect) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        const token = jwt.sign(

            {
                id: faculty._id,
                role: "faculty",
                facultyId: faculty.facultyId
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );

        res.status(200).json({

            success: true,

            message: "Faculty login successful",

            token,

            faculty: {

                id: faculty._id,

                name: faculty.name,

                facultyId: faculty.facultyId,

                email: faculty.email,

                department: faculty.department

            }

        });

    } catch (error) {

        console.log(
            "FACULTY LOGIN ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// STUDENT LOGIN
// ======================================================

const studentLogin = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        console.log(
            "Student Login:",
            email
        );

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"

            });

        }

        const student =
            await Student.findOne({

                email:
                    email.toLowerCase()

            });

        if (!student) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }

        /*
        IMPORTANT:

        This assumes the Student model has
        a password field containing a bcrypt hash.
        */

        const isPasswordCorrect =
            await bcrypt.compare(

                password,

                student.password

            );

        if (!isPasswordCorrect) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }

        const token = jwt.sign(

            {
                id: student._id,

                role: "student",

                rollNumber:
                    student.rollNumber
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );

        res.status(200).json({

            success: true,

            message:
                "Student login successful",

            token,

            student: {

                id: student._id,

                name: student.name,

                rollNumber:
                    student.rollNumber,

                email:
                    student.email,

                department:
                    student.department,

                semester:
                    student.semester

            }

        });

    } catch (error) {

        console.log(
            "STUDENT LOGIN ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    adminLogin,

    facultyLogin,

    studentLogin

};