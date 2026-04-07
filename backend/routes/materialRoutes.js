const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createMaterial,
  getAllMaterials,
  deleteMaterial
} = require("../controllers/materialController");

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
  "/materials",
  requireAuth,
  requireRole("MENTOR"),
  upload.array("files", 10), 
  createMaterial
);

router.get(
  "/materials",
  requireAuth,
  requireRole("MENTOR"),
  getAllMaterials
);

router.delete(
  "/materials/:id",
  requireAuth,
  requireRole("MENTOR"),
  deleteMaterial
);

module.exports = router;