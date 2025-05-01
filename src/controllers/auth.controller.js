const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const logger = require('../utils/logger');

// Login controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Требуется указать email и пароль' });
        }

        logger.info('Login attempt for email:', email);

        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        logger.info('Found users:', users.length);

        const user = users[0];
        if (!user) {
            logger.warn('No user found with email:', email);
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        logger.info('Password validation result:', isValidPassword);

        if (!isValidPassword) {
            logger.warn('Invalid password for user:', email);
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role,
                name: user.name 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        logger.info('Login successful for user:', email);
        logger.info('User role:', user.role);

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Register controller
const register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        // Check if user already exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await db.query(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, name, role]
        );

        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            userId: result.insertId
        });
    } catch (error) {
        logger.error('Register error:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Logout controller
const logout = async (req, res) => {
    // JWT is stateless, so we just return success
    // In a real app, you might want to invalidate the token on the client side
    res.json({ message: 'Başarıyla çıkış yapıldı' });
};

// Refresh token controller
const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token gerekli' });
        }

        // Verify existing token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get fresh user data
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
        const user = users[0];

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Generate new token
        const newToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token: newToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        logger.error('Refresh token error:', error);
        res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token' });
    }
};

// Get profile controller
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [users] = await db.query(
            'SELECT id, email, name, role FROM users WHERE id = ?',
            [userId]
        );
        const user = users[0];

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        res.json(user);
    } catch (error) {
        logger.error('Get profile error:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Change password controller
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.userId;

        // Get user from database
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        const user = users[0];

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Mevcut şifre hatalı' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        res.json({ message: 'Şifre başarıyla güncellendi' });
    } catch (error) {
        logger.error('Change password error:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

module.exports = {
    login,
    register,
    logout,
    refreshToken,
    getProfile,
    changePassword
}; 