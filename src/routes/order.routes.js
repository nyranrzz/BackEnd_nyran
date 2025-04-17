const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const orderController = require('../controllers/order.controller');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create a new order - market users can create orders
router.post('/', authorize('market'), orderController.createOrder);

// Get all orders for a market - market can only access their own
router.get('/market/:marketId', orderController.getMarketOrders);

// Get a specific order by ID - market users can only access their own orders
router.get('/:id', async (req, res, next) => {
  try {
    // Get the order
    const order = await require('../models/order.model').getOrderById(req.params.id);
    
    // If no order or user is not admin/baza and not the market owner
    if (!order) {
      return res.status(404).json({ message: 'Sifariş tapılmadı' });
    }
    
    // If user is admin or baza, allow access
    if (['admin', 'baza'].includes(req.user.role)) {
      return next();
    }
    
    // If user is market, only allow access to their own orders
    if (req.user.role === 'market' && req.user.userId !== order.market_id) {
      return res.status(403).json({ message: 'Bu sifarişə baxmaq üçün icazəniz yoxdur' });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server xətası' });
  }
}, orderController.getOrderById);

module.exports = router; 