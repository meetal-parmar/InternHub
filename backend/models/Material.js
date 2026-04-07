const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // ✅ selected interns
    assignedInterns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ✅ uploaded files
    files: [
      {
        fileName: String,
        filePath: String,
        fileType: String,
      },
    ],

    // ✅ external links
    links: [
      {
        label: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);