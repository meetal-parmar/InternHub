
const Material = require("../models/Material");


exports.getInternMaterials = async (req, res) => {
  try {
    const materials = await Material.find({
      assignedInterns: req.user.id,
    })
      .populate("mentorId", "name profilePic")
      .sort({ createdAt: -1 });

    const formatted = materials.map((mat) => {
      const isRead = mat.readBy.includes(req.user.id);

      return {
        _id: mat._id,
        title: mat.title,
        description: mat.description,

        fileCount: mat.files.length,
        linkCount: mat.links.length,

        createdAt: mat.createdAt,

        readPercent: isRead ? 100 : 0, // UI ke liye
        isRead,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate("mentorId", "name profilePic");

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    const isRead = material.readBy.includes(req.user.id);

    res.json({
      success: true,
      data: {
        ...material._doc,
        readPercent: isRead ? 100 : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    if (!material.readBy.includes(req.user.id)) {
      material.readBy.push(req.user.id);
      await material.save();
    }

    res.json({
      success: true,
      message: "Material marked as read",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};