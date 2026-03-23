const User = require('../models/usersModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const sendEmail = require('../utils/sendEmail');

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