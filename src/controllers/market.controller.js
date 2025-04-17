const bcrypt = require('bcryptjs');
const db = require('../config/db');
const logger = require('../utils/logger');

const marketController = {
    // Get all markets
    async getAllMarkets(req, res) {
        try {
            logger.info('Fetching all markets');
            logger.info('Database connection check...');
            
            // Test database connection
            await db.query('SELECT 1');
            logger.info('Database connection successful');
            
            const [markets] = await db.query(
                'SELECT id, name, email FROM users WHERE role = "market"'
            );
            
            logger.info(`Query executed, results: ${JSON.stringify(markets)}`);
            
            if (!markets || !markets.length) {
                logger.warn('No markets found in database');
                return res.json([]); // Return empty array instead of 404
            }

            logger.info(`Found ${markets.length} markets`);
            res.json(markets);
        } catch (error) {
            logger.error('Error in getAllMarkets:', {
                error: error.message,
                stack: error.stack,
                code: error.code,
                sqlMessage: error.sqlMessage
            });
            res.status(500).json({ 
                message: 'Server xətası',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Get market by ID
    async getMarketById(req, res) {
        try {
            const { id } = req.params;
            logger.info(`Fetching market with ID: ${id}`);
            
            const [market] = await db.query(
                'SELECT id, name, email, phone, address, status FROM users WHERE id = ? AND role = "market"',
                [id]
            );

            if (!market.length) {
                logger.warn(`No market found with ID: ${id}`);
                return res.status(404).json({ message: 'Market tapılmadı' });
            }

            res.json(market[0]);
        } catch (error) {
            logger.error(`Error fetching market ${req.params.id}:`, error);
            res.status(500).json({ message: 'Server xətası' });
        }
    },

    // Create new market
    async createMarket(req, res) {
        try {
            const { name, email, phone, address, password } = req.body;
            
            if (!name || !email || !phone || !password) {
                return res.status(400).json({ message: 'Bütün məlumatları daxil edin' });
            }

            logger.info(`Creating new market: ${name}`);
            
            const [existingMarket] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
            if (existingMarket.length) {
                return res.status(400).json({ message: 'Bu email artıq istifadə olunur' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await db.query(
                'INSERT INTO users (name, email, phone, address, password, role, status) VALUES (?, ?, ?, ?, ?, "market", "active")',
                [name, email, phone, address || null, hashedPassword]
            );

            logger.info(`Created new market with ID: ${result.insertId}`);
            res.status(201).json({ id: result.insertId, message: 'Market uğurla yaradıldı' });
        } catch (error) {
            logger.error('Error creating market:', error);
            res.status(500).json({ message: 'Server xətası' });
        }
    },

    // Update market
    async updateMarket(req, res) {
        try {
            const { id } = req.params;
            const { name, email, phone, address, status } = req.body;

            logger.info(`Updating market ${id}`);
            
            const [existingMarket] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
            if (!existingMarket.length) {
                return res.status(404).json({ message: 'Market tapılmadı' });
            }

            await db.query(
                'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, status = ? WHERE id = ?',
                [name, email, phone, address, status, id]
            );

            logger.info(`Successfully updated market ${id}`);
            res.json({ message: 'Market məlumatları yeniləndi' });
        } catch (error) {
            logger.error(`Error updating market ${req.params.id}:`, error);
            res.status(500).json({ message: 'Server xətası' });
        }
    },

    // Delete market
    async deleteMarket(req, res) {
        try {
            const { id } = req.params;
            logger.info(`Deleting market ${id}`);

            const [existingMarket] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
            if (!existingMarket.length) {
                return res.status(404).json({ message: 'Market tapılmadı' });
            }

            await db.query('DELETE FROM users WHERE id = ?', [id]);
            
            logger.info(`Successfully deleted market ${id}`);
            res.json({ message: 'Market silindi' });
        } catch (error) {
            logger.error(`Error deleting market ${req.params.id}:`, error);
            res.status(500).json({ message: 'Server xətası' });
        }
    },

    // Get market transactions
    async getMarketTransactions(req, res) {
        try {
            const { id } = req.params;
            logger.info(`Fetching transactions for market ${id}`);

            const [transactions] = await db.query(
                'SELECT * FROM market_transactions WHERE market_id = ? ORDER BY created_at DESC',
                [id]
            );

            logger.info(`Found ${transactions.length} transactions for market ${id}`);
            res.json(transactions);
        } catch (error) {
            logger.error(`Error fetching transactions for market ${req.params.id}:`, error);
            res.status(500).json({ message: 'Server xətası' });
        }
    }
};

module.exports = marketController; 