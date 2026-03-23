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

  dateOfBirth: {
    type: Date,
    required: [true, "DOB is required"],
    validate: {
      validator: function (value) {
        const today = new Date();

        if (value > today) return false; // future not allowed

        let age = today.getFullYear() - value.getFullYear();
        const m = today.getMonth() - value.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < value.getDate())) {
          age--;
        }

        return age >= 21; // mentor should be at least 21
      },
      message: "Mentor must be at least 21 years old"
    }
  },

  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female", "Other"]
  },

  linkedinUrl: {
    type: String,
    required: [true, "LinkedIn URL is required"],
    match: [/^https?:\/\/.+/, "Enter valid LinkedIn URL"]
  },

  githubUrl: {
    type: String,
    required: [true, "GitHub URL is required"],
    match: [/^https?:\/\/.+/, "Enter valid GitHub URL"]
  },

  expertise: {
    type: String,
    required: [true, "Expertise is required"],
    trim: true,
    minlength: [2, "Expertise must be at least 2 characters"]
  },

  experience: {
    type: Number,
    required: [true, "Experience is required"],
    min: [0, "Experience cannot be negative"],
    max: [50, "Experience seems unrealistic"]
  },

  designation: {
    type: String,
    required: [true, "Designation is required"],
    trim: true
  },

  bio: {
    type: String,
    maxlength: [200, "Bio cannot exceed 200 characters"],
    default: ""
  }

}, { timestamps: true });

module.exports = mongoose.model("MentorProfile", mentorProfileSchema);