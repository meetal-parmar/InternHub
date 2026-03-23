const mongoose = require("mongoose");

const mentorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters"]
  },

  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^[0-9]{10}$/, "Phone number must be 10 digits"]
  },

 
 gender: {
  type: String,
  enum: ["Male", "Female", "Other"],
  required: [true, "Gender is required"]
},


  expertise: {
    type: String,
    required: [true, "Expertise is required"],
    trim: true,
    minlength: [2, "Expertise must be at least 2 characters"]
  }

}, { timestamps: true });

module.exports = mongoose.model("MentorProfile", mentorProfileSchema);