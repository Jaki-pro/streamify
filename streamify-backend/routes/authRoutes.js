const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public 
router.post('/google', authController.googleSign);

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
// router.post('/login', authController.login);

// @route   POST /api/auth/google
// @desc    Authenticate with Google
// @access  Public
// router.post('/google', authController.googleSignIn);

module.exports = router; 