const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const productController = require('../controllers/product.controller');
const logger = require('../utils/logger');

// Get all products - authenticated users
router.get('/', authenticateToken, productController.getAllProducts);

// Get product by ID - authenticated users
router.get('/:id', authenticateToken, productController.getProductById);

// Create product - admin and baza users
router.post('/', 
  authenticateToken, 
  (req, res, next) => {
    // Log user information for debugging
    logger.info(`User attempting to create product: ${JSON.stringify({
      userId: req.user?.userId,
      role: req.user?.role,
      body: req.body
    })}`);
    next();
  },
  authorize('admin', 'baza'), 
  productController.createProduct
);

// Update product
router.put('/:id', authenticateToken, authorize('admin'), (req, res) => {
    res.json({ 
        success: true,
        message: 'Ürün güncelleme işlevi henüz tamamlanmadı' 
    });
});

// Delete product
router.delete('/:id', authenticateToken, authorize('admin'), (req, res) => {
    res.json({ 
        success: true,
        message: 'Ürün silme işlevi henüz tamamlanmadı' 
    });
});

module.exports = router; 