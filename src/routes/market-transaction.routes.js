const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const marketTransactionController = require('../controllers/market-transaction.controller');
const logger = require('../utils/logger');

// Test endpoints (authentication gerekmez)
router.get('/test', (req, res) => {
  res.json({ message: 'Market transactions API is working!' });
});

// Transaction kaydet (InfoPanel'den)
router.post('/', authenticateToken, (req, res, next) => {
  logger.info(`Received market transaction request: ${JSON.stringify(req.body)}`);
  logger.info(`User: ${JSON.stringify(req.user)}`);
  next();
}, marketTransactionController.saveTransaction);

// Belirli bir tarih için tüm market işlemlerini getir (ReportsPanel için)
router.get('/date/:date', authenticateToken, marketTransactionController.getTransactionsByDate);

// Belirli bir market ve tarih için işlem getir
router.get('/market/:marketId/date/:date', authenticateToken, marketTransactionController.getMarketTransactionByDate);

// Belirli bir market ve tarih için işlem sil
router.delete('/market/:marketId/date/:date', authenticateToken, marketTransactionController.deleteMarketTransactionByDate);

module.exports = router; 