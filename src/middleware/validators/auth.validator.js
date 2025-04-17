const { body, validationResult } = require('express-validator');

// Login validation rules
const validateLogin = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email boş olamaz')
        .isEmail()
        .withMessage('Geçerli bir email adresi giriniz'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Şifre boş olamaz'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Change password validation rules
const validateChangePassword = [
    body('currentPassword')
        .trim()
        .notEmpty()
        .withMessage('Mevcut şifre boş olamaz'),
    body('newPassword')
        .trim()
        .notEmpty()
        .withMessage('Yeni şifre boş olamaz')
        .isLength({ min: 6 })
        .withMessage('Yeni şifre en az 6 karakter olmalıdır'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateLogin,
    validateChangePassword
}; 