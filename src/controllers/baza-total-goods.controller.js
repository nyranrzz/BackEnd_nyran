const BazaTotalGoods = require('../models/baza-total-goods.model');
const logger = require('../utils/logger');

const bazaTotalGoodsController = {
  // Belirli bir market için total_goods değerini kaydet
  async saveTotalGoods(req, res) {
    try {
      const { marketId, totalGoods, transactionDate } = req.body;
      
      logger.info(`Saving total goods for market ${marketId}: ${totalGoods}`);
      
      // Validasyon
      if (!marketId) {
        return res.status(400).json({ success: false, message: 'Market ID tələb olunur' });
      }
      
      if (totalGoods === undefined || totalGoods === null) {
        return res.status(400).json({ success: false, message: 'Total goods değeri tələb olunur' });
      }
      
      const result = await BazaTotalGoods.saveTotalGoods(
        marketId,
        totalGoods,
        transactionDate
      );
      
      res.json({
        success: true,
        message: result.isUpdate ? 'Total goods güncellendi' : 'Total goods kaydedildi',
        id: result.id,
        isUpdate: result.isUpdate
      });
    } catch (error) {
      logger.error('Error saving total goods:', {
        error: error.message,
        stack: error.stack,
        body: req.body
      });
      res.status(500).json({ success: false, message: 'Server xətası' });
    }
  },
  
  // Belirli bir market ve tarih için total_goods değerini getir
  async getTotalGoodsByDate(req, res) {
    try {
      const { marketId, date } = req.params;
      
      logger.info(`Getting total goods for market ${marketId} on date ${date}`);
      
      const totalGoods = await BazaTotalGoods.getTotalGoodsByDate(marketId, date);
      
      res.json({
        success: true,
        totalGoods
      });
    } catch (error) {
      logger.error(`Error getting total goods for market ${req.params.marketId}:`, {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ success: false, message: 'Server xətası' });
    }
  },
  
  // Belirli bir tarih için tüm marketlerin total_goods değerlerini getir
  async getAllTotalGoodsByDate(req, res) {
    try {
      const { date } = req.params;
      
      logger.info(`Getting all total goods for date ${date}`);
      
      const records = await BazaTotalGoods.getAllTotalGoodsByDate(date);
      
      res.json({
        success: true,
        count: records.length,
        records
      });
    } catch (error) {
      logger.error(`Error getting all total goods for date ${req.params.date}:`, {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ success: false, message: 'Server xətası' });
    }
  }
};

module.exports = bazaTotalGoodsController; 