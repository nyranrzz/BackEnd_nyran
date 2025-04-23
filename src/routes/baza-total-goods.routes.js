const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const bazaTotalGoodsController = require('../controllers/baza-total-goods.controller');
const logger = require('../utils/logger');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Baza total goods API is working!' });
});

// Market için total_goods kaydet
router.post('/', authenticateToken, (req, res, next) => {
  logger.info(`Received save total goods request: ${JSON.stringify(req.body)}`);
  logger.info(`User: ${JSON.stringify(req.user)}`);
  next();
}, bazaTotalGoodsController.saveTotalGoods);

// Belirli bir market ve tarih için total_goods getir
router.get('/market/:marketId/date/:date', authenticateToken, (req, res, next) => {
  logger.info(`Received get total goods for market request: ${JSON.stringify(req.params)}`);
  logger.info(`User: ${JSON.stringify(req.user)}`);
  next();
}, bazaTotalGoodsController.getTotalGoodsByDate);

// Belirli bir tarih için tüm marketlerin total_goods değerlerini getir
router.get('/date/:date', authenticateToken, (req, res, next) => {
  logger.info(`Received get all total goods request: ${JSON.stringify(req.params)}`);
  logger.info(`User: ${JSON.stringify(req.user)}`);
  next();
}, bazaTotalGoodsController.getAllTotalGoodsByDate);

module.exports = router; 