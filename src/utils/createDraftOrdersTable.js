const db = require('../config/db');
const logger = require('./logger');

async function createDraftOrdersTable() {
    try {
        logger.info('Creating draft_orders table...');
        
        // SQL for creating draft_orders table
        const createTableSQL = `
        CREATE TABLE IF NOT EXISTS draft_orders (
            id INT PRIMARY KEY AUTO_INCREMENT,
            market_id INT NOT NULL,
            product_id INT NOT NULL,
            quantity DECIMAL(10,2) DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (market_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id),
            UNIQUE KEY market_product_unique (market_id, product_id)
        );
        `;
        
        // Execute query
        await db.query(createTableSQL);
        
        logger.info('Draft orders table created successfully!');
        process.exit(0);
    } catch (error) {
        logger.error('Error creating draft orders table:', {
            error: error.message,
            stack: error.stack,
            code: error.code,
            sqlMessage: error.sqlMessage
        });
        process.exit(1);
    }
}

// Run the function
createDraftOrdersTable(); 