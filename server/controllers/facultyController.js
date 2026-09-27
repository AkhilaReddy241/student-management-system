const Faculty = require("../models/Faculty");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/email");

// ======================================================
// CREATE FACULTY
// ======================================================

const createFaculty = async (req, res) => {
    try {
        console.log("Faculty Request Body:", req.body);

        const {
            name,
            facultyId,
            email,
            password,
            department,
            phone
        } = req.body;

        // Validate required fields
        if (
            !name ||
            !facultyId ||
            !email ||
            !password ||
            !department
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, faculty ID, email, password and department are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check email
        const existingEmail = await Faculty.findOne({
            email: normalizedEmail
        });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Faculty email already exists"
            });
        }

        // Check faculty ID
        const existingFacultyId = await Faculty.findOne({
            facultyId: facultyId.trim()
        });

        if (existingFacultyId) {
            return res.status(400).json({
                success: false,
                message: "Faculty ID already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // Create faculty
        const faculty = await Faculty.create({
            name: name.trim(),
            facultyId: facultyId.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            department: department.trim().toUpperCase(),
            phone: phone || "",
            role: "faculty",
            isActive: true
        });

        console.log(
            "Faculty created:",
            faculty.email
        );

        // Never send password
        res.status(201).json({
            success: true,
            message: "Faculty created successfully",
            data: {
                id: faculty._id,
                name: faculty.name,
                facultyId: faculty.facultyId,
                email: faculty.email,
                department: faculty.department,
                phone: faculty.phone,
                role: faculty.role,
                isActive: faculty.isActive
            }
        });

    } catch (error) {

        console.log(
            "CREATE FACULTY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET ALL FACULTY
// ======================================================

const getAllFaculty = async (req, res) => {
    try {

        const faculty = await Faculty.find()
            .select("-password");

        res.status(200).json({
            success: true,
            count: faculty.length,
            data: faculty
        });

    } catch (error) {

        console.log(
            "GET FACULTY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET FACULTY BY ID
// ======================================================

const getFacultyById = async (req, res) => {
    try {

        const faculty = await Faculty.findById(
            req.params.id
        ).select("-password");

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        res.status(200).json({
            success: true,
            data: faculty
        });

    } catch (error) {

        console.log(
            "GET FACULTY BY ID ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// UPDATE FACULTY
// ======================================================

const updateFaculty = async (req, res) => {
    try {

        const {
            name,
            facultyId,
            email,
            department,
            phone
        } = req.body;

        const faculty = await Faculty.findByIdAndUpdate(
            req.params.id,
            {
                name,
                facultyId,
                email: email
                    ? email.trim().toLowerCase()
                    : undefined,
                department: department
                    ? department.trim().toUpperCase()
                    : undefined,
                phone
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Faculty updated successfully",
            data: faculty
        });

    } catch (error) {

        console.log(
            "UPDATE FACULTY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// DELETE FACULTY
// ======================================================

const deleteFaculty = async (req, res) => {
    try {

        const faculty = await Faculty.findByIdAndDelete(
            req.params.id
        );

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Faculty deleted successfully"
        });

    } catch (error) {

        console.log(
            "DELETE FACULTY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET FACULTY PROFILE
// GET /api/faculty/profile
// ======================================================

const getProfile = async (req, res) => {
    try {

        // Check JWT secret
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is missing"
            });
        }

        // Get Authorization header
        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is missing"
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log(
            "Decoded Faculty JWT:",
            decoded
        );

        // Get faculty ID from token
        const facultyId = decoded.id;

        if (!facultyId) {
            return res.status(400).json({
                success: false,
                message: "Faculty ID missing from token"
            });
        }

        // Find faculty
        const faculty = await Faculty.findById(
            facultyId
        ).select("-password");

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Faculty profile fetched successfully",
            data: faculty
        });

    } catch (error) {

        console.error(
            "GET FACULTY PROFILE ERROR:",
            error
        );

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to get faculty profile",
            error: error.message
        });
    }
};


// ======================================================
// FORGOT PASSWORD
// POST /api/faculty/forgot-password
// ======================================================

const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const faculty = await Faculty.findOne({
            email: normalizedEmail
        });

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty with this email does not exist"
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // OTP valid for 10 minutes
        faculty.resetOTP = otp;

        faculty.resetOTPExpiry = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await faculty.save();

        // Send OTP email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: faculty.email,
            subject:
                "Student Management System - Faculty Password Reset OTP",
            text:
                `Your password reset OTP is ${otp}. ` +
                `This OTP is valid for 10 minutes.`
        });

        res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email"
        });

    } catch (error) {

        console.error(
            "FACULTY FORGOT PASSWORD ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to send OTP"
        });
    }
};


// ======================================================
// VERIFY OTP
// POST /api/faculty/verify-otp
// ======================================================

const verifyOTP = async (req, res) => {
    try {

        const {
            email,
            otp
        } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const faculty = await Faculty.findOne({
            email: normalizedEmail
        });

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty with this email does not exist"
            });
        }

        if (
            !faculty.resetOTP ||
            !faculty.resetOTPExpiry
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "OTP not found. Please request a new OTP"
            });
        }

        // Check OTP expiry
        if (new Date() > faculty.resetOTPExpiry) {

            faculty.resetOTP = null;
            faculty.resetOTPExpiry = null;

            await faculty.save();

            return res.status(400).json({
                success: false,
                message:
                    "OTP has expired. Please request a new OTP"
            });
        }

        // Check OTP
        if (faculty.resetOTP !== otp.trim()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {

        console.error(
            "FACULTY VERIFY OTP ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


// ======================================================
// RESET PASSWORD
// POST /api/faculty/reset-password
// ======================================================

const resetPassword = async (req, res) => {
    try {

        const {
            email,
            otp,
            newPassword
        } = req.body;

        if (
            !email ||
            !otp ||
            !newPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Email, OTP and new password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const faculty = await Faculty.findOne({
            email: normalizedEmail
        });

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message:
                    "Faculty with this email does not exist"
            });
        }

        if (
            !faculty.resetOTP ||
            !faculty.resetOTPExpiry
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "OTP not found. Please request a new OTP"
            });
        }

        // Check OTP expiry
        if (new Date() > faculty.resetOTPExpiry) {

            faculty.resetOTP = null;
            faculty.resetOTPExpiry = null;

            await faculty.save();

            return res.status(400).json({
                success: false,
                message:
                    "OTP has expired. Please request a new OTP"
            });
        }

        // Check OTP
        if (faculty.resetOTP !== otp.trim()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Password validation
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        faculty.password = hashedPassword;

        // Clear OTP after successful reset
        faculty.resetOTP = null;
        faculty.resetOTPExpiry = null;

        await faculty.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {

        console.error(
            "FACULTY RESET PASSWORD ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    createFaculty,
    getAllFaculty,
    getFacultyById,
    updateFaculty,
    deleteFaculty,
    getProfile,
    forgotPassword,
    verifyOTP,
    resetPassword
};