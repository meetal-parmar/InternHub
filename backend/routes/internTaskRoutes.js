const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const { 
  getInternTasks, 
  getTaskDetails, 
  startTask, 
  submitTask,
  getTaskStats   // ✅ ADD THIS
} = require("../controllers/internTaskController");

const { requireAuth, requireRole } = require("../middleware/requireAuth");


/* ================= MULTER SETUP ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


/* ================= ROUTES ================= */

// ✅ 1. Dashboard List (with filter support)
router.get(
  "/my-tasks",
  requireAuth,
  requireRole("INTERN"),
  getInternTasks
);

// ✅ 2. Dashboard Stats (NEW 🔥)
router.get(
  "/task-stats",
  requireAuth,
  requireRole("INTERN"),
  getTaskStats
);

// ✅ 3. Task Detail Panel
router.get(
  "/task/:id",
  requireAuth,
  requireRole("INTERN"),
  getTaskDetails
);

// ✅ 4. Start Task
router.patch(
  "/task/start/:id",
  requireAuth,
  requireRole("INTERN"),
  startTask
);

// ✅ 5. Submit Task (WITH FILE UPLOAD 🔥)
router.patch(
  "/task/submit/:id",
  requireAuth,
  requireRole("INTERN"),
  upload.single("submissionFile"),   // 👈 IMPORTANT
  submitTask
);

module.exports = router;