
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    internId: {
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

    deadline: {
      type: Date,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Submitted",
        "Under Review",
        "Changes Requested",
        "Approved",
        "Overdue",
      ],
      default: "Pending",
    },

    mentorAttachment: {
      type: String,
      default: "",
    },

    submissionLink: {
      type: String,
      default: "",
    },

    submissionNotes: {
      type: String,
      default: "",
    },

    mentorFeedback: {
      type: String,
      default: "",
    },

    // ✅ review history
    reviewHistory: [
      {
        feedback: String,
        decision: String,
        supportLink: String,
        supportFile: String,
        reviewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ✅ future intern resubmission history
    submissionVersions: [
      {
        submissionLink: String,
        submissionNotes: String,
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);