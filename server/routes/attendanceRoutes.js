const express = require("express");

const router = express.Router();

const {
  markAttendance,
  getAttendance,
  deleteAttendance,
  checkAttendance,
  getMonthlyAttendanceReport,
  getStudentAttendance,
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// =====================================================
// CHECK ATTENDANCE
// =====================================================

router.get(
  "/check",
  checkAttendance
);

// =====================================================
// MONTHLY REPORT
// =====================================================

router.get(
  "/monthly-report",
  getMonthlyAttendanceReport
);

// =====================================================
// GET ALL ATTENDANCE
// =====================================================

router.get(
  "/",
  getAttendance
);

// =====================================================
// GET STUDENT ATTENDANCE
// =====================================================

router.get(
  "/student",
  getStudentAttendance
);

// =====================================================
// MARK ATTENDANCE
// =====================================================

router.post(
  "/",
  markAttendance
);

// =====================================================
// DELETE ATTENDANCE
// =====================================================

router.delete(
  "/:id",
  deleteAttendance
);

module.exports = router;