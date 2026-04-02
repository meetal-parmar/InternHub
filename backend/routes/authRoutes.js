const express = require('express');
const router = express.Router();

const userController = require('../controllers/authController');

router.post('/login',userController.loginUser);

router.post('/signup',userController.signupUser);

router.post("/logout", userController.logoutUser);

router.post("/forgot-password", userController.forgotPassword);
router.post("/verify-otp", userController.verifyOTP); 
router.post("/reset-password", userController.resetPassword);

module.exports = router;