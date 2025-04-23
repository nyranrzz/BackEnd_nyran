const db = require('../config/db');
const logger = require('../utils/logger');

class MarketTotal {
  // Save or update total received amount for a market
  static async saveTotalReceived(marketId, totalAmount) {
    try {
      // First check if the table exists, if not create it
      await this.ensureTableExists();
      
      // Check if there's already a record for this market
      const [existingRecords] = await db.query(
        `SELECT id FROM market_total_received WHERE market_id = ?`,
        [marketId]
      );

      if (existingRecords.length > 0) {
        // Update existing record
        await db.query(
          `UPDATE market_total_received 
           SET total_amount = ?, updated_at = CURRENT_TIMESTAMP
           WHERE market_id = ?`,
          [totalAmount, marketId]
        );
        return existingRecords[0].id;
      } else {
        // Create new record
        const [result] = await db.query(
          `INSERT INTO market_total_received (market_id, total_amount) 
           VALUES (?, ?)`,
          [marketId, totalAmount]
        );
        return result.insertId;
      }
    } catch (error) {
      logger.error(`Error saving total received for market ${marketId}:`, {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Get total received amount for a market
  static async getTotalReceived(marketId) {
    try {
      // First check if the table exists, if not create it
      await this.ensureTableExists();
      
      const [records] = await db.query(
        `SELECT total_amount FROM market_total_received WHERE market_id = ?`,
        [marketId]
      );
      
      if (records.length > 0) {
        return records[0].total_amount;
      } else {
        return 0; // Default value if no record found
      }
    } catch (error) {
      logger.error(`Error getting total received for market ${marketId}:`, {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
  
  // Ensure the table exists
  static async ensureTableExists() {
    try {
      // Check if table exists
      const [tables] = await db.query(`
        SELECT COUNT(*) as count FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = 'market_total_received'
      `);
      
      if (tables[0].count === 0) {
        // Table doesn't exist, create it
        await db.query(`
          CREATE TABLE market_total_received (
            id INT PRIMARY KEY AUTO_INCREMENT,
            market_id INT NOT NULL,
            total_amount DECIMAL(10,2) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (market_id) REFERENCES users(id),
            UNIQUE KEY unique_market (market_id)
          )
        `);
        logger.info('Created market_total_received table');
      }
    } catch (error) {
      logger.error('Error ensuring market_total_received table exists:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}

module.exports = MarketTotal; 