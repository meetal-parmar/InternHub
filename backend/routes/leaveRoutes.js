// routes/leaveRoutes.js
const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const { requireAuth, requireRole } = require("../middleware/requireAuth");

// Intern Only
router.post("/apply", requireAuth, requireRole("INTERN"), leaveController.applyLeave);
router.get("/intern", requireAuth, requireRole("INTERN"), leaveController.getInternLeaves);
router.delete("/cancel/:id", requireAuth, requireRole("INTERN"), leaveController.deleteLeave);

// Mentor Only
router.get("/mentor", requireAuth, requireRole("MENTOR"), leaveController.getMentorLeaves);
router.post("/status", requireAuth, requireRole("MENTOR"), leaveController.updateStatus);

module.exports = router;