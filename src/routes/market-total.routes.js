const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const marketTotalController = require('../controllers/market-total.controller');
const db = require('../config/db');
const logger = require('../utils/logger');

// Simple test route that doesn't require authentication
router.get('/test', (req, res) => {
  res.json({ message: 'Market total API is working!' });
});

// Root endpoint for both getting and setting (without authentication for testing)
router.get('/', async (req, res) => {
  try {
    const { marketId } = req.query;
    
    if (!marketId) {
      return res.status(400).json({ 
        message: 'Market ID required',
        success: false
      });
    }
    
    logger.info(`Getting total for marketId=${marketId} via root endpoint`);
    
    // Simple direct database query
    try {
      // Create table if not exists
      await db.query(`
        CREATE TABLE IF NOT EXISTS market_total_received (
          id INT PRIMARY KEY AUTO_INCREMENT,
          market_id INT NOT NULL,
          total_amount DECIMAL(10,2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY unique_market (market_id)
        )
      `);
      
      const [records] = await db.query(
        `SELECT total_amount FROM market_total_received WHERE market_id = ?`,
        [marketId]
      );
      
      let totalAmount = 0;
      if (records.length > 0) {
        totalAmount = records[0].total_amount;
      }
      
      logger.info(`Found total ${totalAmount} for market ${marketId}`);
      
      res.json({ totalAmount, success: true });
    } catch (error) {
      logger.error(`Database error: ${error.message}`);
      res.status(500).json({ 
        message: 'Database error', 
        error: error.message,
        success: false
      });
    }
  } catch (error) {
    logger.error(`Error in GET /: ${error.message}`);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      success: false
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { marketId, totalAmount } = req.body;
    
    if (!marketId || totalAmount === undefined) {
      return res.status(400).json({ 
        message: 'Market ID and totalAmount required',
        success: false
      });
    }
    
    logger.info(`Saving total: marketId=${marketId}, total=${totalAmount} via root endpoint`);
    
    // Simple direct database query
    try {
      // Create table if not exists
      await db.query(`
        CREATE TABLE IF NOT EXISTS market_total_received (
          id INT PRIMARY KEY AUTO_INCREMENT,
          market_id INT NOT NULL,
          total_amount DECIMAL(10,2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY unique_market (market_id)
        )
      `);
      
      // Insert or update
      const [result] = await db.query(
        `INSERT INTO market_total_received (market_id, total_amount) 
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE total_amount = VALUES(total_amount)`,
        [marketId, totalAmount]
      );
      
      logger.info(`Saved total ${totalAmount} for market ${marketId}`);
      
      res.json({ 
        success: true, 
        message: 'Total saved',
        id: result.insertId || 0
      });
    } catch (error) {
      logger.error(`Database error: ${error.message}`);
      res.status(500).json({ 
        message: 'Database error', 
        error: error.message,
        success: false
      });
    }
  } catch (error) {
    logger.error(`Error in POST /: ${error.message}`);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      success: false
    });
  }
});

// Protect all other routes with authentication
router.use(authenticateToken);

// Original routes (now with authentication)
router.post('/totals', marketTotalController.saveTotalReceived);
router.get('/totals/:marketId', marketTotalController.getTotalReceived);

module.exports = router; 