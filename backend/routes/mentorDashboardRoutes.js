const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAttendanceTrends,
  getMentorNotifications,
} = require("../controllers/mentorDashboardController");

const { requireAuth, requireRole } = require("../middleware/requireAuth");

router.get(
  "/stats",
  requireAuth,
  requireRole("MENTOR"),
  getDashboardStats
);

router.get(
  "/attendance-trends",
  requireAuth,
  requireRole("MENTOR"),
  getAttendanceTrends
);

router.get(
  "/notifications",
  requireAuth,
  requireRole("MENTOR"),
  getMentorNotifications
);

module.exports = router;