const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const logger = require('./logger');

async function setupDatabase() {
    try {
        logger.info('Starting database setup...');
        
        // Read SQL file
        const sqlFile = path.join(__dirname, '../../database.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');
        
        // Split SQL statements
        const statements = sql.split(';').filter(statement => statement.trim().length > 0);
        
        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i].trim();
            if (statement) {
                logger.info(`Executing SQL statement ${i + 1}/${statements.length}...`);
                await db.query(statement);
                logger.info('Statement executed successfully.');
            }
        }
        
        logger.info('Database setup completed successfully!');
        process.exit(0);
    } catch (error) {
        logger.error('Error setting up database:', {
            error: error.message,
            stack: error.stack,
            code: error.code,
            sqlMessage: error.sqlMessage
        });
        process.exit(1);
    }
}

// Run the setup
setupDatabase(); 