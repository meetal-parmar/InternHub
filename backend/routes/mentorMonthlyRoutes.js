const express = require("express");
const router = express.Router();
const mentorMonthlyController = require("../controllers/mentorMonthlyController");
const { requireAuth, requireRole } = require("../middleware/requireAuth");

router.get(
  "/mentor/monthlySummary/:internId",
  requireAuth,
  requireRole("MENTOR"),
  mentorMonthlyController.getMonthlyAnalysisByMentor
);

router.get("/mentor/interns", requireAuth, requireRole("MENTOR"), async (req, res) => {
    const interns = await User.find({ role: "INTERN" }).select("name _id");
    res.json({ success: true, interns });
});

module.exports = router;