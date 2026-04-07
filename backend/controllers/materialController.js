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