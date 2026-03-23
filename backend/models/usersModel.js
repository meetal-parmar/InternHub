const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
     name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["INTERN", "MENTOR"],
      required: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    },
    
    mentor: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: function() {
         return this.role === "INTERN";
       }
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: false
    }
});

module.exports = mongoose.model("User",userSchema);