const express = require("express");
const router = express.Router();

const {
  getInternMaterials,
  getMaterialById,
  markAsRead,
} = require("../controllers/internMaterialController");

const { requireAuth } = require("../middleware/requireAuth");

router.get("/intern", requireAuth, getInternMaterials);
router.get("/:id", requireAuth, getMaterialById);
router.put("/read/:id", requireAuth, markAsRead);

module.exports = router;