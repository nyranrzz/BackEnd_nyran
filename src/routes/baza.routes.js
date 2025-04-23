const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const orderController = require('../controllers/order.controller');

// Protect all routes with authentication and proper authorization
router.use(authenticateToken, authorize('baza', 'admin'));

// Get all pending orders from markets
router.get('/orders', orderController.getPendingOrders);

// Get specific order details
router.get('/orders/:id', orderController.getOrderById);

// Approve market order with prices and quantities
router.post('/approve/:id', orderController.approveOrder);

// Clear all pending orders - new endpoint
router.post('/clear-orders', orderController.clearAllOrders);

// Baza prices endpoints
router.post('/prices', orderController.saveBazaPrices);
router.get('/prices', orderController.getBazaPrices);
router.post('/clear-prices', orderController.clearBazaPrices);

module.exports = router; 