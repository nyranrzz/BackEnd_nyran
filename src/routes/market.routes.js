const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const { 
    getAllMarkets,
    getMarketById,
    createMarket,
    updateMarket,
    deleteMarket,
    getMarketTransactions
} = require('../controllers/market.controller');

// Public route - anyone can get list of markets
router.get('/', getAllMarkets);

// Protected routes - role-based authorization
router.get('/:id', authenticateToken, authorize('admin', 'baza'), getMarketById);
router.post('/', authenticateToken, authorize('admin'), createMarket);
router.put('/:id', authenticateToken, authorize('admin'), updateMarket);
router.delete('/:id', authenticateToken, authorize('admin'), deleteMarket);
router.get('/:id/transactions', authenticateToken, authorize('admin', 'baza', 'market'), getMarketTransactions);

module.exports = router; 