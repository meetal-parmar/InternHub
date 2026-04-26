const User = require('../models/usersModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const sendEmail = require('../utils/sendEmail');
const InternProfile = require("../models/InternProfile");
const Timelog = require("../models/Timelog");



exports.createIntern = async (req, res) => {
  try {
 
    const { name, email, password } = req.body;

    let errors = {};
    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({
        errors: { email: "Invalid email format" }
      });
    }

    const exist = await User.findOne({ email: cleanEmail });
    if (exist) {
      return res.status(400).json({
        errors: { email: "Email already exists" }
      });
    }

     if (!req.user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const plainPassword = password;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const intern = await User.create({
      name,
      email: cleanEmail,
      password: hash,
      role: "INTERN",
      mentor: req.user._id   
    });

     await sendEmail(cleanEmail,plainPassword);

    res.status(201).json({
      message: "Intern created successfully",
      intern: {
        _id: intern._id,
        name: intern.name,
        email: intern.email,
        role: intern.role,
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// mentorController.js mein getMyInterns function ko update karein
exports.getMyInterns = async (req, res) => {
  try {
    const mentorId = req.user._id;

    const interns = await User.find({
      mentor: mentorId,
      role: "INTERN"
    }).select("-password").lean();

    const result = await Promise.all(
      interns.map(async (intern) => {
        const profile = await InternProfile.findOne({
          userId: intern._id
        }).lean();

        return {
          ...intern,
          isActive: intern.isActive !== false,
          profile
        };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSingleIntern = async (req, res) => {
  try {
    const { id } = req.params;

    const intern = await User.findOne({
      _id: id,
      mentor: req.user._id,
      role: "INTERN"
    }).select("-password");

    if (!intern) {
      return res.status(404).json({
        message: "Intern not found"
      });
    }

    const profile = await InternProfile.findOne({
      userId: intern._id
    });

    res.json({
      ...intern.toObject(),
      profile
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.deactivateIntern = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      isActive: false
    });

    res.json({
      message: "Intern deactivated"
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getInternTimelogTimeline = async (req, res) => {
  try {
    const { internId } = req.params;
    const { date } = req.query;

    // 1) Check intern belongs to mentor
    const intern = await User.findOne({
      _id: internId,
      role: "INTERN",
      mentor: req.user._id
    });

    if (!intern) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    // 2) Date range
    const startDay = new Date(date);
    startDay.setHours(0, 0, 0, 0);

    const endDay = new Date(date);
    endDay.setHours(23, 59, 59, 999);

    // 3) Get logs
    const logs = await Timelog.find({
      internId,
      workDate: { $gte: startDay, $lte: endDay }
    }).sort({ startDecimal: 1 });

    const totalHours = logs.reduce(
      (sum, log) => sum + log.totalHours,
      0
    );

    res.status(200).json({
      success: true,
      internName: intern.name,
      totalHours: totalHours.toFixed(2),
      data: logs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};