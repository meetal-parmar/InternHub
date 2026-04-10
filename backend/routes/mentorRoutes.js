const express = require("express");
const router = express.Router();

const mentorController = require("../controllers/mentorController");
const { requireAuth, requireRole } = require("../middleware/requireAuth");



router.post(
  "/create-intern",
  requireAuth,
  requireRole("MENTOR"),
  mentorController.createIntern
);

router.get(
  "/interns",
  requireAuth,
  requireRole("MENTOR"),
  mentorController.getMyInterns
);


router.get(
  "/intern/:id",
  requireAuth,
  requireRole("MENTOR"),
  mentorController.getSingleIntern
);

// ✅ Mark intern inactive
router.patch(
  "/interns/:id/inactive",
  requireAuth,
  requireRole("MENTOR"),
  mentorController.deactivateIntern
);

router.get(
  "/intern-timeline/:internId",
  requireAuth,
  requireRole("MENTOR"),
  mentorController.getInternTimelogTimeline
);

module.exports = router;