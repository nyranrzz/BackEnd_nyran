const db = require('../config/db');
const logger = require('../utils/logger');

class BazaTotalGoods {
  // Save or update total goods for a market
  static async saveTotalGoods(marketId, totalGoods, transactionDate) {
    try {
      // Tarih formatını YYYY-MM-DD olarak kontrol et
      const date = transactionDate ? new Date(transactionDate) : new Date();
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD formatı
      
      logger.info(`Saving total goods for market ${marketId} on date ${formattedDate}: ${totalGoods}`);
      
      // Ensure the table exists
      await this.ensureTableExists();
      
      // Check if there's already a record for this market and date
      const [existingRecords] = await db.query(
        `SELECT id FROM baza_total_goods 
         WHERE market_id = ? AND transaction_date = ?`,
        [marketId, formattedDate]
      );
      
      if (existingRecords.length > 0) {
        // Update existing record
        const [result] = await db.query(
          `UPDATE baza_total_goods 
           SET total_goods = ?, updated_at = CURRENT_TIMESTAMP
           WHERE market_id = ? AND transaction_date = ?`,
          [parseFloat(totalGoods) || 0, marketId, formattedDate]
        );
        
        logger.info(`Updated total goods for market ${marketId} on date ${formattedDate}`);
        return { 
          id: existingRecords[0].id,
          isUpdate: true
        };
      } else {
        // Insert new record
        const [result] = await db.query(
          `INSERT INTO baza_total_goods 
           (market_id, total_goods, transaction_date)
           VALUES (?, ?, ?)`,
          [marketId, parseFloat(totalGoods) || 0, formattedDate]
        );
        
        logger.info(`Inserted new total goods for market ${marketId} on date ${formattedDate}`);
        return {
          id: result.insertId,
          isUpdate: false
        };
      }
    } catch (error) {
      logger.error(`Error saving total goods for market ${marketId}:`, {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
  
  // Get total goods for a market on a specific date
  static async getTotalGoodsByDate(marketId, transactionDate) {
    try {
      // Tarih formatını YYYY-MM-DD olarak kontrol et
      const date = transactionDate ? new Date(transactionDate) : new Date();
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD formatı
      
      logger.info(`Getting total goods for market ${marketId} on date ${formattedDate}`);
      
      // Ensure the table exists
      await this.ensureTableExists();
      
      const [records] = await db.query(
        `SELECT total_goods FROM baza_total_goods 
         WHERE market_id = ? AND transaction_date = ?`,
        [marketId, formattedDate]
      );
      
      if (records.length > 0) {
        logger.info(`Found total goods for market ${marketId} on date ${formattedDate}: ${records[0].total_goods}`);
        return parseFloat(records[0].total_goods) || 0;
      } else {
        logger.info(`No total goods found for market ${marketId} on date ${formattedDate}`);
        return 0;
      }
    } catch (error) {
      logger.error(`Error getting total goods for market ${marketId}:`, {
        error: error.message,
        stack: error.stack
      });
      return 0;
    }
  }
  
  // Get total goods for all markets on a specific date
  static async getAllTotalGoodsByDate(transactionDate) {
    try {
      // Tarih formatını YYYY-MM-DD olarak kontrol et
      const date = transactionDate ? new Date(transactionDate) : new Date();
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD formatı
      
      logger.info(`Getting total goods for all markets on date ${formattedDate}`);
      
      // Ensure the table exists
      await this.ensureTableExists();
      
      const [records] = await db.query(
        `SELECT btg.*, u.name as market_name
         FROM baza_total_goods btg
         JOIN users u ON btg.market_id = u.id
         WHERE btg.transaction_date = ?
         ORDER BY u.name ASC`,
        [formattedDate]
      );
      
      logger.info(`Found ${records.length} total goods records for date ${formattedDate}`);
      
      return records.map(record => ({
        ...record,
        total_goods: parseFloat(record.total_goods) || 0
      }));
    } catch (error) {
      logger.error(`Error getting total goods for all markets:`, {
        error: error.message,
        stack: error.stack
      });
      return [];
    }
  }
  
  // Ensure the table exists
  static async ensureTableExists() {
    try {
      // Check if table exists
      const [tables] = await db.query(`
        SELECT COUNT(*) as count FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = 'baza_total_goods'
      `);
      
      if (tables[0].count === 0) {
        // Table doesn't exist, create it
        await db.query(`
          CREATE TABLE IF NOT EXISTS baza_total_goods (
            id INT PRIMARY KEY AUTO_INCREMENT,
            market_id INT NOT NULL,
            total_goods DECIMAL(10,2) DEFAULT 0,
            transaction_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (market_id) REFERENCES users(id),
            UNIQUE KEY unique_market_date (market_id, transaction_date)
          )
        `);
        logger.info('Created baza_total_goods table');
      }
    } catch (error) {
      logger.error('Error ensuring baza_total_goods table exists:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}

module.exports = BazaTotalGoods; 