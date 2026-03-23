const mongoose = require("mongoose");

const internProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  fullName: {
    type: String,
    required: [true, "FullName is required"]
  },

  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"]
  },

  dateOfBirth: {
    type: Date,
    required: [true, "DOB is required"],
    validate: {
      validator: function (value) {
        const today = new Date();
        let age = today.getFullYear() - value.getFullYear();
        const m = today.getMonth() - value.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < value.getDate())) {
          age--;
        }

        return age >= 18;
      },
      message: "Intern must be at least 18 years old"
    }
  },

  gender: {
    type: String,
    required: true
  },

  collegeName: {
    type: String,
    required: true
  },

  degree: {
    type: String,
    required: true
  },

  yearOrSemester: {
    type: String,
    required: true
  },

  linkedinUrl: {
    type: String,
    required: true,
    match: [/^https?:\/\/.+/, "Enter valid LinkedIn URL"]
  },

  githubUrl: {
    type: String,
    required: true,
    match: [/^https?:\/\/.+/, "Enter valid GitHub URL"]
  },

  internshipStartDate: {
    type: Date,
    required: true
  },

  internshipEndDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.internshipStartDate;
      },
      message: "End date must be after start date"
    }
  }

}, { timestamps: true });

module.exports = mongoose.model("InternProfile", internProfileSchema);