const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');

// Tüm admin rotalarını yetkilendir
router.use(authenticateToken, authorize('admin'));

// Admin paneli geçici olarak devre dışı
router.use('*', (req, res) => {
    res.status(503).json({
        success: false,
        message: 'Admin paneli geçici olarak kullanım dışıdır. Lütfen daha sonra tekrar deneyin.'
    });
});

// Aşağıdaki rotalar şu anda aktif değil
/*
// Genel dashboard verilerini getir
router.get('/dashboard', (req, res) => {
    res.json({ 
        success: true,
        message: 'Dashboard verileri henüz tamamlanmadı' 
    });
});

// Kullanıcı yönetimi
router.get('/users', (req, res) => {
    res.json({ 
        success: true,
        message: 'Kullanıcı listesi henüz tamamlanmadı' 
    });
});

// Sistem ayarları
router.get('/settings', (req, res) => {
    res.json({ 
        success: true,
        message: 'Sistem ayarları henüz tamamlanmadı' 
    });
});
*/

module.exports = router; 