const db = require('../config/db');
const logger = require('./logger');

async function createTransactionsTable() {
    try {
        logger.info('Creating transactions table...');
        
        // SQL for creating transactions table
        const createTableSQL = `
        CREATE TABLE IF NOT EXISTS transactions (
            id INT PRIMARY KEY AUTO_INCREMENT,
            market_id INT NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL,
            paid_amount DECIMAL(10,2) NOT NULL,
            remaining_amount DECIMAL(10,2) NOT NULL,
            status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (market_id) REFERENCES users(id)
        );
        `;
        
        // Execute query
        await db.query(createTableSQL);
        
        logger.info('Transactions table created successfully!');
        process.exit(0);
    } catch (error) {
        logger.error('Error creating transactions table:', {
            error: error.message,
            stack: error.stack,
            code: error.code,
            sqlMessage: error.sqlMessage
        });
        process.exit(1);
    }
}

// Run the function
createTransactionsTable(); 