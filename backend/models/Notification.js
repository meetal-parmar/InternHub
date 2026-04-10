
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"], // kis user ko notification jayega
  },

  title: {
    type: String,
    required: [true, "Title is required"], // short heading
    maxlength: [100, "Title too long"],
  },

  message: {
    type: String,
    required: [true, "Message is required"], // full message
    maxlength: [500, "Message too long"],
  },

  type: {
    type: String,
    enum: ["leave_apply", "leave_approved", "leave_rejected"],
    required: true,
  },

  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Leave", // kis leave se related hai
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  readAt: {
    type: Date,
  },

}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);