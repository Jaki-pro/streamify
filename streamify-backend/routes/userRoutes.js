const express = require('express'); 
const userController = require('../controllers/userController');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public 
router.get('/me',  userController.me);

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
// router.post('/login', authController.login);

// @route   POST /api/auth/google
// @desc    Authenticate with Google
// @access  Public
// router.post('/google', authController.googleSignIn);

module.exports = router; 