const db = require('../config/db');
const logger = require('../utils/logger');

class DraftOrder {
  // Save a draft order item - either insert new or update existing
  static async saveDraftItem(marketId, productId, quantity) {
    try {
      // Check if there's already a draft for this market and product
      const [existingDrafts] = await db.query(
        `SELECT id FROM draft_orders WHERE market_id = ? AND product_id = ?`,
        [marketId, productId]
      );

      if (existingDrafts.length > 0) {
        // Update existing draft
        await db.query(
          `UPDATE draft_orders SET quantity = ? WHERE market_id = ? AND product_id = ?`,
          [quantity, marketId, productId]
        );
        return existingDrafts[0].id;
      } else {
        // Create new draft
        const [result] = await db.query(
          `INSERT INTO draft_orders (market_id, product_id, quantity) VALUES (?, ?, ?)`,
          [marketId, productId, quantity]
        );
        return result.insertId;
      }
    } catch (error) {
      logger.error(`Error saving draft item for market ${marketId}, product ${productId}:`, {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Get all draft items for a market
  static async getDraftsByMarketId(marketId) {
    try {
      const [drafts] = await db.query(
        `SELECT do.id, do.product_id, p.name as product_name, do.quantity, do.updated_at 
         FROM draft_orders do
         JOIN products p ON do.product_id = p.id
         WHERE do.market_id = ?
         ORDER BY p.name ASC`,
        [marketId]
      );
      return drafts;
    } catch (error) {
      logger.error(`Error getting drafts for market ${marketId}:`, {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Delete all drafts for a market
  static async clearDraftsByMarketId(marketId) {
    try {
      const [result] = await db.query(
        `DELETE FROM draft_orders WHERE market_id = ?`,
        [marketId]
      );
      return {
        success: true,
        deletedCount: result.affectedRows
      };
    } catch (error) {
      logger.error(`Error clearing drafts for market ${marketId}:`, {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Save multiple draft items at once
  static async saveDraftItems(marketId, items) {
    try {
      let savedCount = 0;
      
      // Start a transaction
      await db.query('START TRANSACTION');
      
      for (const item of items) {
        if (item.productId && item.quantity > 0) {
          await this.saveDraftItem(marketId, item.productId, item.quantity);
          savedCount++;
        }
      }
      
      // Commit the transaction
      await db.query('COMMIT');
      
      return {
        success: true,
        savedCount
      };
    } catch (error) {
      // Rollback in case of error
      await db.query('ROLLBACK');
      
      logger.error(`Error saving draft items for market ${marketId}:`, {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}

module.exports = DraftOrder; 