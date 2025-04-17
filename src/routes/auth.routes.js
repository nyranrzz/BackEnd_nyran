const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { login, register, logout, refreshToken, getProfile, changePassword } = require('../controllers/auth.controller');

// Public routes - no authentication required
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected routes - require authentication
router.post('/register', authenticateToken, register); // Only authenticated admins should register users
router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, getProfile);
router.post('/change-password', authenticateToken, changePassword);

module.exports = router; 