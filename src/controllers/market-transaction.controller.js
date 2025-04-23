const db = require('../config/db');
const logger = require('../utils/logger');

const marketTransactionController = {
  // Yeni bir transaction ekle (InfoPanel'den)
  async saveTransaction(req, res) {
    try {
      const { 
        marketId, 
        totalReceived, 
        damagedGoods, 
        cashRegister, 
        cash, 
        salary, 
        expenses, 
        difference, 
        remainder,
        transactionDate 
      } = req.body;

      // Log gelen veriyi
      logger.info(`Saving market transaction: ${JSON.stringify(req.body)}`);

      // Validasyon
      if (!marketId) {
        return res.status(400).json({ success: false, message: 'Market ID tələb olunur' });
      }

      // Gelen tarihi kullan veya bugünün tarihini al
      const date = transactionDate ? new Date(transactionDate) : new Date();
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD formatı

      // Önce bu marketin bu tarih için zaten bir kaydı var mı kontrol et
      const [existingRecords] = await db.query(
        `SELECT id FROM market_transactions 
         WHERE market_id = ? AND transaction_date = ?`,
        [marketId, formattedDate]
      );

      let result;
      if (existingRecords.length > 0) {
        // Bu tarih için zaten kayıt var, güncelle
        [result] = await db.query(
          `UPDATE market_transactions 
           SET 
             total_received = ?, 
             damaged_goods = ?, 
             cash_register = ?, 
             cash = ?, 
             salary = ?, 
             expenses = ?, 
             difference = ?, 
             remainder = ?
           WHERE market_id = ? AND transaction_date = ?`,
          [
            parseFloat(totalReceived) || 0,
            parseFloat(damagedGoods) || 0,
            parseFloat(cashRegister) || 0,
            parseFloat(cash) || 0,
            parseFloat(salary) || 0,
            parseFloat(expenses) || 0,
            parseFloat(difference) || 0,
            parseFloat(remainder) || 0,
            marketId,
            formattedDate
          ]
        );
        
        logger.info(`Updated market transaction for market ${marketId} on ${formattedDate}`);
        return res.json({ 
          success: true, 
          message: 'Günlük hesabat yeniləndi', 
          id: existingRecords[0].id,
          isUpdate: true
        });
      } else {
        // Yeni kayıt oluştur
        [result] = await db.query(
          `INSERT INTO market_transactions 
           (market_id, total_received, damaged_goods, cash_register, cash, salary, expenses, difference, remainder, transaction_date) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            marketId,
            parseFloat(totalReceived) || 0,
            parseFloat(damagedGoods) || 0,
            parseFloat(cashRegister) || 0,
            parseFloat(cash) || 0,
            parseFloat(salary) || 0,
            parseFloat(expenses) || 0,
            parseFloat(difference) || 0,
            parseFloat(remainder) || 0,
            formattedDate
          ]
        );
        
        logger.info(`Created new market transaction for market ${marketId} on ${formattedDate}`);
        return res.json({ 
          success: true, 
          message: 'Günlük hesabat yadda saxlanıldı', 
          id: result.insertId,
          isUpdate: false
        });
      }
    } catch (error) {
      logger.error('Error saving market transaction:', {
        error: error.message,
        stack: error.stack,
        body: req.body
      });
      res.status(500).json({ success: false, message: 'Server xətası' });
    }
  },

  // Belirli bir tarih için tüm marketlerin transactions verilerini getir (ReportsPanel için)
  async getTransactionsByDate(req, res) {
    try {
      const { date } = req.params;
      logger.info(`Getting market transactions for date: ${date}`);

      // Tüm marketlerin bu tarihteki işlemlerini al
      const [transactions] = await db.query(
        `SELECT mt.*, u.name as market_name
         FROM market_transactions mt
         JOIN users u ON mt.market_id = u.id
         WHERE mt.transaction_date = ?
         ORDER BY u.name ASC`,
        [date]
      );

      // Sayısal değerleri doğru formatta olduğundan emin ol
      const formattedTransactions = transactions.map(transaction => ({
        ...transaction,
        total_received: parseFloat(transaction.total_received || 0),
        damaged_goods: parseFloat(transaction.damaged_goods || 0),
        cash_register: parseFloat(transaction.cash_register || 0),
        cash: parseFloat(transaction.cash || 0),
        salary: parseFloat(transaction.salary || 0),
        expenses: parseFloat(transaction.expenses || 0),
        difference: parseFloat(transaction.difference || 0),
        remainder: parseFloat(transaction.remainder || 0)
      }));

      logger.info(`Found ${transactions.length} transactions for date ${date}`);
      res.json(formattedTransactions);
    } catch (error) {
      logger.error(`Error getting transactions for date ${req.params.date}:`, {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ success: false, message: 'Server xətası' });
    }
  },

  // Belirli bir market ve tarih için transaction getir
  async getMarketTransactionByDate(req, res) {
    try {
      const { marketId, date } = req.params;
      logger.info(`Getting market transaction for market ${marketId} and date ${date}`);

      const [transactions] = await db.query(
        `SELECT * FROM market_transactions 
         WHERE market_id = ? AND transaction_date = ?`,
        [marketId, date]
      );

      if (transactions.length === 0) {
        return res.json(null);
      }

      // Sayısal değerleri doğru formatta olduğundan emin ol
      const transaction = {
        ...transactions[0],
        total_received: parseFloat(transactions[0].total_received || 0),
        damaged_goods: parseFloat(transactions[0].damaged_goods || 0),
        cash_register: parseFloat(transactions[0].cash_register || 0),
        cash: parseFloat(transactions[0].cash || 0),
        salary: parseFloat(transactions[0].salary || 0),
        expenses: parseFloat(transactions[0].expenses || 0),
        difference: parseFloat(transactions[0].difference || 0),
        remainder: parseFloat(transactions[0].remainder || 0)
      };

      logger.info(`Found transaction for market ${marketId} on date ${date}`);
      res.json(transaction);
    } catch (error) {
      logger.error(`Error getting transaction for market ${req.params.marketId} and date ${req.params.date}:`, {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ success: false, message: 'Server xətası' });
    }
  },

  // Belirli bir market ve tarih için transaction sil
  async deleteMarketTransactionByDate(req, res) {
    try {
      const { marketId, date } = req.params;
      logger.info(`Deleting market transaction for market ${marketId} and date ${date}`);

      // Önce bu market ve tarih için kayıt var mı kontrol et
      const [checkRecords] = await db.query(
        `SELECT id FROM market_transactions 
         WHERE market_id = ? AND transaction_date = ?`,
        [marketId, date]
      );

      if (checkRecords.length === 0) {
        logger.info(`No transaction found for market ${marketId} on date ${date} to delete`);
        return res.json({ 
          success: false, 
          message: 'Bu tarix üçün məlumat tapılmadı',
          deleted: false
        });
      }

      // Kaydı sil
      const [result] = await db.query(
        `DELETE FROM market_transactions 
         WHERE market_id = ? AND transaction_date = ?`,
        [marketId, date]
      );
      
      logger.info(`Deleted transaction for market ${marketId} on date ${date}, affected rows: ${result.affectedRows}`);
      
      return res.json({ 
        success: true, 
        message: 'Məlumatlar silindi', 
        deleted: true,
        affectedRows: result.affectedRows 
      });
    } catch (error) {
      logger.error(`Error deleting transaction for market ${req.params.marketId} and date ${req.params.date}:`, {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ success: false, message: 'Server xətası' });
    }
  }
};

module.exports = marketTransactionController; 