const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Logger
const logger = require('./src/utils/logger');

// Database connection check
const db = require('./src/config/db');   ////////////

// Routes
const authRoutes = require('./src/routes/auth.routes');
const marketRoutes = require('./src/routes/market.routes');
const bazaRoutes = require('./src/routes/baza.routes');
const adminRoutes = require('./src/routes/admin.routes');
const productRoutes = require('./src/routes/product.routes');
const transactionRoutes = require('./src/routes/transaction.routes');
const orderRoutes = require('./src/routes/order.routes');
const draftOrderRoutes = require('./src/routes/draft-order.routes');
const marketTotalRoutes = require('./src/routes/market-total.routes');
const marketTransactionRoutes = require('./src/routes/market-transaction.routes');
const bazaTotalGoodsRoutes = require('./src/routes/baza-total-goods.routes');

// Middleware
const errorHandler = require('./src/middleware/errorHandler');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for checking if server is running
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        message: 'Market İdarəetmə API serveri işləyir',
        version: process.env.npm_package_version || '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/baza', bazaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/draft-orders', draftOrderRoutes);
app.use('/api/market-total', marketTotalRoutes);
app.use('/api/market-transactions', marketTransactionRoutes);
app.use('/api/baza-total-goods', bazaTotalGoodsRoutes);

// Error Handler - must be last
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

// Database connection test
const testDbConnection = async () => {
    try {
        await db.query('SELECT 1');
        logger.info('Database connection successful');
    } catch (error) {
        logger.error('Database connection failed:', {
            error: error.message,
            stack: error.stack,
            code: error.code,
            sqlMessage: error.sqlMessage
        });
        process.exit(1);
    }
};

// Start the server
const startServer = async () => {
    await testDbConnection(); ////////////////////////
    
    app.listen(PORT, '0.0.0.0', () => {
        logger.info(`Server running on port ${PORT}`);
        console.log(`Market İdarəetmə API serveri ${PORT} portunda işləyir`);
    });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    console.error('Unhandled Rejection:', err);
});

// Start the server
startServer();

module.exports = app; // Export for testing 