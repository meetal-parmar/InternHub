const express = require("express");
const router = express.Router();

const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile
} = require("../controller/ProfileController");

router.post("/", createProfile);
router.get("/:role/:userId", getProfile);
router.put("/:role/:userId", updateProfile);
router.delete("/:role/:userId", deleteProfile);

module.exports = router;