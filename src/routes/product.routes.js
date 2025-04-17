const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const productController = require('../controllers/product.controller');

// Get all products - authenticated users
router.get('/', authenticateToken, productController.getAllProducts);

// Get product by ID - authenticated users
router.get('/:id', authenticateToken, productController.getProductById);

// Create, update, delete only for admin users
router.post('/', authenticateToken, authorize('admin'), (req, res) => {
    res.json({ 
        success: true,
        message: 'Ürün ekleme işlevi henüz tamamlanmadı' 
    });
});

router.put('/:id', authenticateToken, authorize('admin'), (req, res) => {
    res.json({ 
        success: true,
        message: 'Ürün güncelleme işlevi henüz tamamlanmadı' 
    });
});

router.delete('/:id', authenticateToken, authorize('admin'), (req, res) => {
    res.json({ 
        success: true,
        message: 'Ürün silme işlevi henüz tamamlanmadı' 
    });
});

module.exports = router; 