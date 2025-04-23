const MarketTotal = require('../models/market-total.model');
const logger = require('../utils/logger');

const marketTotalController = {
  // Save total received amount for a market
  async saveTotalReceived(req, res) {
    try {
      const { marketId, totalAmount } = req.body;
      logger.info(`Saving total: marketId=${marketId}, total=${totalAmount}`);

      if (!marketId || totalAmount === undefined) {
        logger.warn('Missing required parameters');
        return res.status(400).json({ message: 'Market ID və toplam məbləğ tələb olunur' });
      }

      // Simplify by directly doing the SQL query here for testing
      const db = require('../config/db');
      try {
        // Check if there's already a record for this market
        const [existingRecords] = await db.query(
          `SELECT id FROM market_total_received WHERE market_id = ?`,
          [marketId]
        );

        let id;
        if (existingRecords.length > 0) {
          // Update existing record
          await db.query(
            `UPDATE market_total_received 
             SET total_amount = ?, updated_at = CURRENT_TIMESTAMP
             WHERE market_id = ?`,
            [totalAmount, marketId]
          );
          id = existingRecords[0].id;
        } else {
          // Create new record
          const [result] = await db.query(
            `INSERT INTO market_total_received (market_id, total_amount) 
             VALUES (?, ?)`,
            [marketId, totalAmount]
          );
          id = result.insertId;
        }

        logger.info(`Successfully saved total received with ID: ${id}`);
        
        res.json({
          success: true,
          message: 'Toplam məbləğ yadda saxlanıldı',
          id
        });
      } catch (dbError) {
        // If there's a database error, let's try to create the table and retry
        logger.error(`Database error: ${dbError.message}`);

        try {
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

          // Try the save operation again after creating the table
          const [result] = await db.query(
            `INSERT INTO market_total_received (market_id, total_amount) 
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE total_amount = VALUES(total_amount)`,
            [marketId, totalAmount]
          );

          logger.info(`Successfully saved total after creating table`);
          
          res.json({
            success: true,
            message: 'Toplam məbləğ yadda saxlanıldı',
            id: result.insertId || 0
          });
        } catch (retryError) {
          logger.error(`Failed to create table and retry: ${retryError.message}`);
          throw retryError;
        }
      }
    } catch (error) {
      logger.error('Error saving total received:', {
        error: error.message,
        stack: error.stack,
        body: req.body
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  },

  // Get total received amount for a market
  async getTotalReceived(req, res) {
    try {
      const { marketId } = req.params;
      logger.info(`Getting total for marketId=${marketId}`);
      
      // Simplify by directly doing the SQL query here for testing
      const db = require('../config/db');
      try {
        const [records] = await db.query(
          `SELECT total_amount FROM market_total_received WHERE market_id = ?`,
          [marketId]
        );
        
        let totalAmount = 0;
        if (records.length > 0) {
          totalAmount = records[0].total_amount;
        }

        logger.info(`Found total received ${totalAmount} for market ID: ${marketId}`);
        
        res.json({
          totalAmount
        });
      } catch (dbError) {
        logger.error(`Database error: ${dbError.message}`);
        // If there's a database error, let's try to create the table and return 0
        try {
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
          
          logger.info('Created market_total_received table');
          res.json({ totalAmount: 0 });
        } catch (retryError) {
          logger.error(`Failed to create table: ${retryError.message}`);
          throw retryError;
        }
      }
    } catch (error) {
      logger.error(`Error fetching total received:`, {
        error: error.message,
        stack: error.stack,
        marketId: req.params.marketId
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  }
};

module.exports = marketTotalController; 