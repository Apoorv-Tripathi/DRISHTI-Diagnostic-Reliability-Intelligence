import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      name: user.name,
      role: user.role
    },
    process.env.JWT_SECRET || 'drishti_super_secret_aerospace_key_2026_sih_mod_secure_jwt',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const cleanUsername = username.toLowerCase().trim();
    const user = await User.findOne({ username: cleanUsername });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `Authentication failed: User '${cleanUsername}' not found in database.`
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: Invalid password entered.'
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
        role: user.role,
        title: user.title,
        department: user.department,
        specialization: user.specialization,
        squadron: user.squadron,
        base: user.base,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication: ' + error.message
    });
  }
});

// @desc    Get current logged in user from JWT
// @route   GET /api/auth/me
// @access  Private (JWT protected)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User session not found in database'
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
        role: user.role,
        title: user.title,
        department: user.department,
        specialization: user.specialization,
        squadron: user.squadron,
        base: user.base,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify session'
    });
  }
});

// @desc    Get all users for assignment and login roster
// @route   GET /api/auth/users
// @access  Public
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ role: 1, name: 1 });
    const formatted = users.map(u => ({
      id: u._id.toString(),
      username: u.username,
      name: u.name,
      role: u.role,
      title: u.title,
      department: u.department,
      specialization: u.specialization,
      squadron: u.squadron,
      base: u.base,
      avatar: u.avatar
    }));

    return res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error('Error fetching users roster:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users roster from database'
    });
  }
});

export default router;
