const express = require("express");

const router = express.Router();

const {
    createFaculty,
    getAllFaculty,
    getFacultyById,
    updateFaculty,
    deleteFaculty,
    getProfile,
    forgotPassword,
    verifyOTP,
    resetPassword
} = require("../controllers/facultyController");


// ==========================================
// FACULTY PROFILE
// ==========================================

router.get("/profile", getProfile);


// ==========================================
// FORGOT PASSWORD
// ==========================================

router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/verify-otp",
    verifyOTP
);

router.post(
    "/reset-password",
    resetPassword
);


// ==========================================
// FACULTY MANAGEMENT
// ==========================================

// Create Faculty
router.post(
    "/",
    createFaculty
);

// Get All Faculty
router.get(
    "/",
    getAllFaculty
);

// Get Faculty By ID
router.get(
    "/:id",
    getFacultyById
);

// Update Faculty
router.put(
    "/:id",
    updateFaculty
);

// Delete Faculty
router.delete(
    "/:id",
    deleteFaculty
);


module.exports = router;