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
            
            // Önce tablo yapısını kontrol edelim - hangi sütunlar var?
            const [columns] = await db.query('DESCRIBE users');
            logger.info(`Users table structure: ${JSON.stringify(columns)}`);
            
            // Kullanılabilir roller neler?
            const [roles] = await db.query('SELECT DISTINCT role FROM users');
            logger.info(`Available roles in users table: ${JSON.stringify(roles)}`);
            
            // Şimdi ilk birkaç kullanıcıyı görelim
            const [sampleUsers] = await db.query('SELECT * FROM users LIMIT 3');
            logger.info(`Sample users from database: ${JSON.stringify(sampleUsers)}`);
            
            // Doğru rol değerini kullanarak marketi seçelim
            // Digital Ocean'daki veritabanında rol değeri farklı olabilir
            let roleValue = 'market';
            
            // Eğer roles dizisi doluysa ve içinde market yoksa alternatif bir değer bulalım
            if (roles.length > 0) {
                const roleFound = roles.find(r => r.role === 'market');
                if (!roleFound) {
                    // Digital Ocean'daki rol ismini öğrenelim
                    // marketplace, store, shop gibi alternatifler olabilir
                    roleValue = roles[0].role; // İlk rol değerini kullanalım
                    logger.info(`Using alternative role value: ${roleValue}`);
                }
            }
            
            // Market rolüne sahip kullanıcıları çekelim
                const [markets] = await db.query(
                    'SELECT id, name FROM users WHERE role = ?',
                [roleValue]
                );
                
            logger.info(`Query executed with role '${roleValue}', results: ${JSON.stringify(markets)}`);
                
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
            
            // Sadece veritabanında bulunan sütunları sorguladık
            const [market] = await db.query(
                'SELECT id, name, email FROM users WHERE id = ?',
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
            const { name, email, password } = req.body;
            
            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Bütün məlumatları daxil edin' });
            }

            logger.info(`Creating new market: ${name}`);
            
            const [existingMarket] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
            if (existingMarket.length) {
                return res.status(400).json({ message: 'Bu email artıq istifadə olunur' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Sadece varolan sütunları ekledik
            const [result] = await db.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, 'market']
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
            const { name, email } = req.body;

            logger.info(`Updating market ${id}`);
            
            const [existingMarket] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
            if (!existingMarket.length) {
                return res.status(404).json({ message: 'Market tapılmadı' });
            }

            // Sadece varolan sütunları güncelledik
            await db.query(
                'UPDATE users SET name = ?, email = ? WHERE id = ?',
                [name, email, id]
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