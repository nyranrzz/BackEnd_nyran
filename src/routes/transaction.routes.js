const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const validateTransaction = require('../middleware/validateTransaction');
const { authenticateToken, authorize } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create a new transaction
router.post('/', validateTransaction, transactionController.createTransaction);

// Get all transactions - admin only
router.get('/', authorize('admin', 'baza'), transactionController.getAllTransactions);

// Get a specific transaction by ID
router.get('/:id', transactionController.getTransactionById);

// Get transactions by market ID - market can only access their own
router.get('/market/:marketId', transactionController.getTransactionsByMarketId);

// Update a transaction - admin only
router.put('/:id', authorize('admin', 'baza'), validateTransaction, transactionController.updateTransaction);

// Delete a transaction - admin only
router.delete('/:id', authorize('admin'), transactionController.deleteTransaction);

module.exports = router; 