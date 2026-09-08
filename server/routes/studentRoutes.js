const express = require("express");

const router = express.Router();

const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  registerStudent,
  loginStudent,
  getProfile,
  resetStudentPassword,
  changeStudentPassword,
} = require("../controllers/studentController");

const authenticateStudent =
  require("../middleware/authMiddleware");

console.log("✅ studentRoutes loaded");

// =====================================================
// REGISTER STUDENT
// POST /api/students/register
// =====================================================

router.post(
  "/register",
  registerStudent
);

// =====================================================
// LOGIN STUDENT
// POST /api/students/login
// =====================================================

router.post(
  "/login",
  loginStudent
);

// =====================================================
// RESET STUDENT PASSWORD
// PUT /api/students/reset-password
// =====================================================

router.put(
  "/reset-password",
  resetStudentPassword
);

// =====================================================
// CREATE STUDENT
// POST /api/students
// =====================================================

router.post(
  "/",
  createStudent
);

// =====================================================
// GET ALL STUDENTS
// GET /api/students
// =====================================================

router.get(
  "/",
  getAllStudents
);

// =====================================================
// GET LOGGED-IN STUDENT PROFILE
// GET /api/students/profile
// =====================================================

router.get(
  "/profile",
  authenticateStudent,
  getProfile
);

// =====================================================
// CHANGE STUDENT PASSWORD
// PUT /api/students/change-password
// =====================================================

router.put(
  "/change-password",
  authenticateStudent,
  changeStudentPassword
);

// =====================================================
// GET STUDENT BY MONGODB ID
// GET /api/students/:id
// =====================================================

router.get(
  "/:id",
  getStudentById
);

// =====================================================
// UPDATE STUDENT
// PUT /api/students/:id
// =====================================================

router.put(
  "/:id",
  updateStudent
);

// =====================================================
// DELETE STUDENT
// DELETE /api/students/:id
// =====================================================

router.delete(
  "/:id",
  deleteStudent
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;