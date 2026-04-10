// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { requireAuth } = require("../middleware/requireAuth");

// Get notifications for logged-in user
router.get("/", requireAuth, async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

// Mark as read
router.put("/read/:id", requireAuth, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

module.exports = router;