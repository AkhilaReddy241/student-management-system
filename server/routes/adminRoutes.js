const express = require("express");

const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  forgotPassword,
    verifyOTP, 
     resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  generateStudentPasswords,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

// =====================================================
// REGISTER ADMIN
// =====================================================

router.post("/register", registerAdmin);

// =====================================================
// LOGIN ADMIN
// =====================================================

router.post("/login", loginAdmin);

// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post("/forgot-password", forgotPassword);


// =====================================================
// VERIFY OTP
// =====================================================

router.post("/verify-otp", verifyOTP);


// =====================================================
// RESET PASSWORD
// =====================================================

router.post("/reset-password", resetPassword);


// =====================================================
// GET ADMIN PROFILE
// =====================================================

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

// =====================================================
// UPDATE ADMIN PROFILE
// =====================================================

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

// =====================================================
// CHANGE PASSWORD
// =====================================================

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

// =====================================================
// GENERATE STUDENT PASSWORDS
// =====================================================

router.post(
  "/generate-student-passwords",
  authMiddleware,
  allowRoles("admin"),
  generateStudentPasswords
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;