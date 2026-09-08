const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getMyReportCard,
} = require("../controllers/reportCardController");

// ======================================================
// STUDENT MY REPORT CARD
// ======================================================

router.get(
  "/my-report-card",
  authMiddleware,
  getMyReportCard
);

module.exports = router;