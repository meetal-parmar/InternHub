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
  required: [true, "Phone number is required"],
  match: [/^[0-9]{10}$/, "Phone number must be 10 digits"]
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
  enum: ["Male", "Female", "Other"],
  required: [true, "Gender is required"]
},

  collegeName: {
  type: String,
  required: [true,"college name is required"],
  minlength: [3, "College name too short"]
},

  degree: {
    type: String,
   required: [true, "degree is required"]
  },

  yearOrSemester: {
    type: String,
     required: [true, "please enter year or semester"]
  },


  internshipStartDate: {
    type: Date,
    required: [true, "internship start date is required"]
  },

  internshipEndDate: {
    type: Date,
     required: [true, "internship end date is required"],
    validate: {
      validator: function (value) {
        return value > this.internshipStartDate;
      },
      message: "End date must be after start date"
    }
  }

}, { timestamps: true });

module.exports = mongoose.model("InternProfile", internProfileSchema);