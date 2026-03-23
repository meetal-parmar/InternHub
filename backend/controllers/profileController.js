const InternProfile = require("../models/InternProfile");
const MentorProfile = require("../models/MentorProfile");

// CREATE
exports.createProfile = async (req, res) => {
  try {
    const { userId, role } = req.body;

    // 🔹 INTERN
    if (role === "intern") {
      const existing = await InternProfile.findOne({ userId });

      if (existing) {
        return res.status(400).json({
          message: "Intern profile already exists"
        });
      }

      const profile = new InternProfile(req.body);
      const data = await profile.save();

      return res.status(201).json(data);
    }

    // 🔹 MENTOR
    if (role === "mentor") {
      const existing = await MentorProfile.findOne({ userId });

      if (existing) {
        return res.status(400).json({
          message: "Mentor profile already exists"
        });
      }

      const profile = new MentorProfile(req.body);
      const data = await profile.save();

      return res.status(201).json(data);
    }

    res.status(400).json({ message: "Invalid role" });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET
exports.getProfile = async (req, res) => {
  try {
    const { userId, role } = req.params;

    let profile;

    if (role === "intern") {
      profile = await InternProfile.findOne({ userId });
    } else if (role === "mentor") {
      profile = await MentorProfile.findOne({ userId });
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE
exports.updateProfile = async (req, res) => {
  try {
    const { userId, role } = req.params;

    let updated;

    if (role === "intern") {
      updated = await InternProfile.findOneAndUpdate(
        { userId },
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      updated = await MentorProfile.findOneAndUpdate(
        { userId },
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.json(updated);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteProfile = async (req, res) => {
  try {
    const { userId, role } = req.params;

    if (role === "intern") {
      await InternProfile.findOneAndDelete({ userId });
    } else {
      await MentorProfile.findOneAndDelete({ userId });
    }

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};