const db = require('../config/db');
const logger = require('../utils/logger');

const adminController = {
  // Get dashboard summary data
  async getDashboard(req, res) {
    try {
      logger.info('Fetching admin dashboard data');
      
      // Get total markets count
      const [marketCountResult] = await db.query(
        'SELECT COUNT(*) as count FROM users WHERE role = ?',
        ['market']
      );
      
      // Get total products count
      const [productCountResult] = await db.query(
        'SELECT COUNT(*) as count FROM products'
      );
      
      // Get total orders count
      const [orderCountResult] = await db.query(
        'SELECT COUNT(*) as count FROM market_orders'
      );
      
      // Get recent activity (last 5 orders)
      const [recentActivity] = await db.query(`
        SELECT mo.id, mo.market_id, u.name as market_name, mo.status, mo.created_at
        FROM market_orders mo
        JOIN users u ON mo.market_id = u.id
        ORDER BY mo.created_at DESC
        LIMIT 5
      `);
      
      res.json({
        success: true,
        message: 'Dashboard verileri başarıyla alındı',
        data: {
          totalMarkets: marketCountResult[0].count,
          totalProducts: productCountResult[0].count,
          totalOrders: orderCountResult[0].count,
          recentActivity
        }
      });
    } catch (error) {
      logger.error('Error fetching admin dashboard data:', {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  },
  
  // Get all users
  async getUsers(req, res) {
    try {
      logger.info('Fetching all users');
      
      const [users] = await db.query(
        'SELECT id, name, email, role, created_at FROM users ORDER BY id'
      );
      
      res.json({
        success: true,
        message: 'Kullanıcı listesi başarıyla alındı',
        users
      });
    } catch (error) {
      logger.error('Error fetching users:', {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  },
  
  // Get system settings
  async getSettings(req, res) {
    try {
      logger.info('Fetching system settings');
      
      // Get baza total amount
      const [totalResult] = await db.query(
        'SELECT SUM(grand_total) as total FROM baza_prices'
      );
      
      const settings = {
        allowMarketOrders: true, // Default setting
        bazaTotalAmount: totalResult[0].total || 0,
        systemVersion: '1.0.0' // Hardcoded for now
      };
      
      res.json({
        success: true,
        message: 'Sistem ayarları başarıyla alındı',
        settings
      });
    } catch (error) {
      logger.error('Error fetching system settings:', {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  }
};

module.exports = adminController; 