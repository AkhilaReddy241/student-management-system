const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
  changePassword,
    generateStudentPasswords,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Register Admin
router.post("/register", registerAdmin);

// Login Admin
router.post("/login", loginAdmin);

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

router.put(
  "/change-password",  authMiddleware,  changePassword);

router.post(
  "/generate-student-passwords",
  authMiddleware,
  allowRoles("admin"),
  generateStudentPasswords
);

module.exports = router;