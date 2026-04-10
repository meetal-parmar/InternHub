// models/Leave.js
const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  internId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Intern ID is required"],
  },

  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Mentor ID is required"],
  },

  fromDate: {
    type: Date,
    required: [true, "From date is required"],
  },

  toDate: {
    type: Date,
    required: [true, "To date is required"],
    validate: {
      validator: function (value) {
        return value >= this.fromDate;
      },
      message: "To date must be after From date",
    },
  },

  days: {
    type: Number,
    required: true,
    min: [1, "Minimum 1 day required"],
  },

  type: {
    type: String,
    enum: ["Sick", "Casual", "Half Leave"],
    required: true,
  },

  reason: {
    type: String,
    required: [true, "Reason is required"],
    minlength: [5, "Reason must be at least 5 characters"],
    maxlength: [300, "Max 300 characters allowed"],
    trim: true,
  },

  // 📧 Only flag (email bhejna hai ya nahi)
//   sendMail: {
//     type: Boolean,
//     default: false,
//   },

//   // Optional: email content
//   emailText: {
//     type: String,
//     maxlength: [1000, "Email too long"],
//   },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },

}, { timestamps: true });

module.exports = mongoose.model("Leave", leaveSchema);