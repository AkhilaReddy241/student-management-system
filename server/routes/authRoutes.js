const express = require("express");

const router = express.Router();

const {
    adminLogin,
    facultyLogin,
    studentLogin
} = require("../controllers/authController");

// ==========================================
// ADMIN LOGIN
// ==========================================

router.post(
    "/admin/login",
    adminLogin
);

// ==========================================
// FACULTY LOGIN
// ==========================================

router.post(
    "/faculty/login",
    facultyLogin
);

// ==========================================
// STUDENT LOGIN
// ==========================================

router.post(
    "/student/login",
    studentLogin
);

module.exports = router;