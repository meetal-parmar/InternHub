const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getReviewQueue,
  reviewTask,
} = require("../controllers/mentorTaskController");

const { requireAuth, requireRole } = require("../middleware/requireAuth");


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post(
  "/task",
  requireAuth,
  requireRole("MENTOR"),
  upload.single("submissionFile"),
  createTask
);

router.get(
  "/tasks",
  requireAuth,
  requireRole("MENTOR"),
  getAllTasks
);

router.put(
  "/task/:id",
  requireAuth,
  requireRole("MENTOR"),
  upload.single("submissionFile"),
  updateTask
);

router.delete(
  "/task/:id",
  requireAuth,
  requireRole("MENTOR"),
  deleteTask
);


router.get(
  "/reviews",
  requireAuth,
  requireRole("MENTOR"),
  getReviewQueue
);

router.patch(
  "/task/:id/review",
  requireAuth,
  requireRole("MENTOR"),
  upload.single("supportFile"),
  reviewTask
);

module.exports = router;