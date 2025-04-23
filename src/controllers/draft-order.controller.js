const DraftOrder = require('../models/draft-order.model');
const logger = require('../utils/logger');

const draftOrderController = {
  // Save order drafts
  async saveDrafts(req, res) {
    try {
      const { marketId, items } = req.body;

      if (!marketId || !items || !Array.isArray(items)) {
        return res.status(400).json({ message: 'Market ID və məhsulların siyahısı tələb olunur' });
      }

      logger.info(`Saving ${items.length} draft items for market ID: ${marketId}`);
      logger.info(`Request body: ${JSON.stringify(req.body)}`);
      
      // Process request items to ensure proper format
      const formattedItems = items.map(item => ({
        productId: item.productId,
        quantity: parseFloat(item.quantity) || 0,
        receivedQuantity: parseFloat(item.receivedQuantity) || 0,
        price: parseFloat(item.price) || 0,
        total: parseFloat(item.total) || 0
      }));

      // Log formatted items to see what we're saving
      logger.info(`Formatted items to save: ${JSON.stringify(formattedItems)}`);

      const result = await DraftOrder.saveDraftItems(marketId, formattedItems);

      logger.info(`Successfully saved ${result.savedCount} draft items for market ID: ${marketId}`);
      
      res.json({
        message: 'Sifariş qaralama olaraq saxlanıldı',
        savedCount: result.savedCount
      });
    } catch (error) {
      logger.error('Error saving draft orders:', {
        error: error.message,
        stack: error.stack,
        body: req.body
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  },

  // Get drafts for a market
  async getMarketDrafts(req, res) {
    try {
      const { marketId } = req.params;
      
      logger.info(`Fetching draft orders for market ID: ${marketId}`);
      
      const drafts = await DraftOrder.getDraftsByMarketId(marketId);
      
      logger.info(`Found ${drafts.length} draft items for market ID: ${marketId}`);
      logger.info(`Draft data: ${JSON.stringify(drafts)}`);
      
      res.json(drafts);
    } catch (error) {
      logger.error(`Error fetching drafts for market ${req.params.marketId}:`, {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  },

  // Clear all draft orders for a market
  async clearMarketDrafts(req, res) {
    try {
      const { marketId } = req.params;
      
      logger.info(`Clearing all draft orders for market ID: ${marketId}`);
      
      const result = await DraftOrder.clearDraftsByMarketId(marketId);
      
      logger.info(`Successfully cleared ${result.deletedCount} draft items for market ID: ${marketId}`);
      
      res.json({
        message: 'Bütün qaralamalar silindi',
        deletedCount: result.deletedCount
      });
    } catch (error) {
      logger.error(`Error clearing drafts for market ${req.params.marketId}:`, {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  }
};

module.exports = draftOrderController; 