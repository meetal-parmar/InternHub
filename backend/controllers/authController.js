const User = require('../models/usersModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require("jsonwebtoken");

const createToken = (_id)=>{
    return jwt.sign({_id},process.env.SECRET,{expiresIn: "3d"})
}

exports.signupUser = async (req, res) => {
  try {
    const { name, email, password, secretCode } = req.body;

    let errors = {};

    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (!secretCode) errors.secretCode = "Secret Code is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({
        errors: { email: "Invalid email format" }
      });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        errors: { password: 'Password not strong enough' }
      });
    }

    if (secretCode.trim() !== process.env.MENTOR_SECRET_CODE.trim()) {
      return res.status(403).json({
        errors: { secretCode: "Invalid Secret Code" }
      });
    }

    const exist = await User.findOne({ email: cleanEmail });
    if (exist) {
      return res.status(400).json({
        errors: { email: "Email already in use" }
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: cleanEmail,
      password: hash,
      role: "MENTOR"
    });

    const maxAge = 3 * 24 * 60 * 60;
    const token = createToken(user._id);
    res.cookie('jwt',token,{
        httpOnly:true, 
        maxAge:maxAge * 1000,
        sameSite: 'Strict',
        secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({
      user: {
    _id: user._id,      
    name: user.name,     
    email: user.email,   
    role: user.role      
  }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async(req,res)=>{
    try {
    const {email , password} = req.body;

    let errors = {};
    if(!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({email : cleanEmail});
    if(!user)
    {
        return res.status(401).json({
         errors: { email: "Invalid credentials" }
        });
    }
    const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json({
                errors: {password: "Incorrect Password"}
            });
        }
        const maxAge = 3 * 24 * 60 * 60;
        const token = createToken(user._id);
        res.cookie('jwt',token,{
            httpOnly: true,
            maxAge: maxAge * 1000,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({
        message: "Login successful",
         user: {
    _id: user._id,      
    name: user.name,     
    email: user.email,   
    role: user.role      
  }
    });
    } catch (error) {
    res.status(500).json({ error: error.message });
  }
}