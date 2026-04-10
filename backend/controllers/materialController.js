const Material = require("../models/Material");

exports.createMaterial = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { title, description } = req.body;

    let assignedInterns = req.body.assignedInterns || [];
    let links = req.body.links || [];

   
    if (typeof assignedInterns === "string") {
      assignedInterns = JSON.parse(assignedInterns);
    }

    if (typeof links === "string") {
      links = JSON.parse(links);
    }

    const files = req.files
      ? req.files.map((file) => ({
          fileName: file.originalname,
          filePath: file.path,
          fileType: file.mimetype,
        }))
      : [];

    const material = await Material.create({
      mentorId,
      title,
      description,
      assignedInterns,
      files,
      links,
    });

    res.status(201).json({
      success: true,
      message: "Material assigned successfully",
      material,
    });
  } catch (error) {
    console.error("Create Material Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create material",
    });
  }
};

exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ mentorId: req.user._id })
      .populate("assignedInterns", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      materials,
    });
  } catch (error) {
    console.error("Fetch Materials Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch materials",
    });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    await Material.findOneAndDelete({
      _id: req.params.id,
      mentorId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Material deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
//intern side

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