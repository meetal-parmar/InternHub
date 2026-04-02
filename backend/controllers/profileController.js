const InternProfile = require("../models/InternProfile");
const MentorProfile = require("../models/MentorProfile");


exports.createProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    
    if (role === "INTERN") {
      const existing = await InternProfile.findOne({ userId });

      if (existing) {
        return res.status(400).json({
          errors: { profile: "Intern profile already exists" }
        });
      }

      const profile = new InternProfile({ ...req.body, userId });
      const data = await profile.save();

      return res.status(201).json({
        message: "Intern profile created",
        data
      });
    }
    if (role === "MENTOR") {
      const existing = await MentorProfile.findOne({ userId });

      if (existing) {
        return res.status(400).json({
          errors: { profile: "Mentor profile already exists" }
        });
      }

      const profile = new MentorProfile({ ...req.body, userId });
      const data = await profile.save();

      return res.status(201).json({
        message: "Mentor profile created",
        data
      });
    }

    return res.status(403).json({
      errors: { role: "Invalid role" }
    });

  } catch (err) {

    if (err.name === "ValidationError") {
      let errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ errors });
    }

    res.status(500).json({
      errors: { server: err.message }
    });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let profile;

    if (role === "INTERN") {
      profile = await InternProfile.findOne({ userId });
    } else if (role === "MENTOR") {
      profile = await MentorProfile.findOne({ userId });
    }

    if (!profile) {
      return res.status(404).json({
        errors: { profile: "Profile not found" }
      });
    }

    res.json(profile);

  } catch (err) {
    res.status(500).json({
      errors: { server: err.message }
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let profile;

    if (role === "INTERN") {
      profile = await InternProfile.findOne({ userId });
    } else if (role === "MENTOR") {
      profile = await MentorProfile.findOne({ userId });
    }

    if (!profile) {
      return res.status(404).json({
        errors: { profile: "Profile not found" }
      });
    }

    Object.assign(profile, req.body);

    const updated = await profile.save();

    res.json({
      message: "Profile updated",
      data: updated
    });

  } catch (err) {
    if (err.name === "ValidationError") {
      let errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ errors });
    }

    res.status(500).json({
      errors: { server: err.message }
    });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let deleted;

    if (role === "INTERN") {
      deleted = await InternProfile.findOneAndDelete({ userId });
    } else if (role === "MENTOR") {
      deleted = await MentorProfile.findOneAndDelete({ userId });
    }

    if (!deleted) {
      return res.status(404).json({
        errors: { profile: "Profile not found" }
      });
    }

    res.json({
      message: "Deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      errors: { server: err.message }
    });
  }
};