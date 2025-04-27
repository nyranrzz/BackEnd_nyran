const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

// Tüm admin rotalarını yetkilendir
router.use(authenticateToken, authorize('admin'));

// Genel dashboard verilerini getir
router.get('/dashboard', adminController.getDashboard);

// Kullanıcı yönetimi
router.get('/users', adminController.getUsers);

// Sistem ayarları
router.get('/settings', adminController.getSettings);

// Şifre değiştirme endpoint'leri
router.post('/change-password', adminController.changeUserPassword);
router.post('/users/:id/change-password', adminController.changeUserPasswordById);

module.exports = router; 