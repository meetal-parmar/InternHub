const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/requireAuth");

const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile
} = require("../controllers/profileController");


router.post("/mentor", requireAuth, requireRole("MENTOR"), createProfile);
router.post("/intern", requireAuth, requireRole("INTERN"), createProfile);

router.get("/", requireAuth, getProfile);
router.put("/", requireAuth, updateProfile);
router.delete("/", requireAuth, deleteProfile);

module.exports = router;