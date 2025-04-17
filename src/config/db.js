const mysql = require('mysql2');
const logger = require('../utils/logger');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promise wrapper for async/await support
const promisePool = pool.promise();

// Test connection function
const testConnection = async () => {
    try {
        const [rows] = await promisePool.query('SELECT 1');
        logger.info('Database connection successful');
        return true;
    } catch (error) {
        logger.error('Database connection error:', {
            error: error.message, 
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage
        });
        return false;
    }
};

module.exports = promisePool;
module.exports.testConnection = testConnection; 