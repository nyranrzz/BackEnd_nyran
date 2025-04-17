const db = require('../config/db');
const logger = require('../utils/logger');

const transactionController = {
    // Create a new transaction
    async createTransaction(req, res) {
        try {
            const { marketId, totalAmount, paidAmount, remainingAmount, status } = req.body;
            
            logger.info(`Creating new transaction for market ID: ${marketId}`);
            
            const [result] = await db.query(
                'INSERT INTO transactions (market_id, total_amount, paid_amount, remaining_amount, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
                [marketId, totalAmount, paidAmount, remainingAmount, status]
            );

            const [newTransaction] = await db.query(
                'SELECT * FROM transactions WHERE id = ?',
                [result.insertId]
            );

            logger.info(`Transaction created with ID: ${result.insertId}`);
            res.status(201).json(newTransaction[0]);
        } catch (error) {
            logger.error('Error creating transaction:', {
                error: error.message,
                stack: error.stack,
                code: error.code,
                sqlMessage: error.sqlMessage
            });
            res.status(500).json({ message: 'Server xətası' });
        }
    },

    // Get all transactions
    async getAllTransactions(req, res) {
        try {
            logger.info('Fetching all transactions');
            
            const [transactions] = await db.query(
                'SELECT t.*, u.name as market_name FROM transactions t JOIN users u ON t.market_id = u.id ORDER BY t.created_at DESC'
            );
            
            logger.info(`Found ${transactions.length} transactions`);
            res.json(transactions);
        } catch (error) {
            logger.error('Error fetching transactions:', {
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({ message: 'Server xətası' });
        }
    },

    // Get transaction by ID
    async getTransactionById(req, res) {
        try {
            const { id } = req.params;
            logger.info(`Fetching transaction with ID: ${id}`);
            
            const [transaction] = await db.query(
                'SELECT t.*, u.name as market_name FROM transactions t JOIN users u ON t.market_id = u.id WHERE t.id = ?',
                [id]
            );

            if (transaction.length === 0) {
                logger.warn(`Transaction with ID ${id} not found`);
                return res.status(404).json({ message: 'Əməliyyat tapılmadı' });
            }

            res.json(transaction[0]);
        } catch (error) {
            logger.error(`Error fetching transaction ${req.params.id}:`, {
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({ message: 'Server xətası' });
        }
    },

    // Get transactions by market ID
    async getTransactionsByMarketId(req, res) {
        try {
            const { marketId } = req.params;
            logger.info(`Fetching transactions for market ID: ${marketId}`);
            
            const [transactions] = await db.query(
                'SELECT t.*, u.name as market_name FROM transactions t JOIN users u ON t.market_id = u.id WHERE t.market_id = ? ORDER BY t.created_at DESC',
                [marketId]
            );
            
            logger.info(`Found ${transactions.length} transactions for market ID: ${marketId}`);
            res.json(transactions);
        } catch (error) {
            logger.error(`Error fetching transactions for market ${req.params.marketId}:`, {
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({ message: 'Server xətası' });
        }
    },

    // Update transaction
    async updateTransaction(req, res) {
        try {
            const { id } = req.params;
            const { marketId, totalAmount, paidAmount, remainingAmount, status } = req.body;
            
            logger.info(`Updating transaction with ID: ${id}`);
            
            const [existingTransaction] = await db.query(
                'SELECT * FROM transactions WHERE id = ?',
                [id]
            );

            if (existingTransaction.length === 0) {
                logger.warn(`Transaction with ID ${id} not found for update`);
                return res.status(404).json({ message: 'Əməliyyat tapılmadı' });
            }

            await db.query(
                'UPDATE transactions SET market_id = ?, total_amount = ?, paid_amount = ?, remaining_amount = ?, status = ?, updated_at = NOW() WHERE id = ?',
                [marketId, totalAmount, paidAmount, remainingAmount, status, id]
            );

            const [updatedTransaction] = await db.query(
                'SELECT t.*, u.name as market_name FROM transactions t JOIN users u ON t.market_id = u.id WHERE t.id = ?',
                [id]
            );

            logger.info(`Transaction ${id} updated successfully`);
            res.json(updatedTransaction[0]);
        } catch (error) {
            logger.error(`Error updating transaction ${req.params.id}:`, {
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({ message: 'Server xətası' });
        }
    },

    // Delete transaction
    async deleteTransaction(req, res) {
        try {
            const { id } = req.params;
            logger.info(`Deleting transaction with ID: ${id}`);
            
            const [existingTransaction] = await db.query(
                'SELECT * FROM transactions WHERE id = ?',
                [id]
            );

            if (existingTransaction.length === 0) {
                logger.warn(`Transaction with ID ${id} not found for deletion`);
                return res.status(404).json({ message: 'Əməliyyat tapılmadı' });
            }

            await db.query('DELETE FROM transactions WHERE id = ?', [id]);
            
            logger.info(`Transaction ${id} deleted successfully`);
            res.json({ message: 'Əməliyyat uğurla silindi' });
        } catch (error) {
            logger.error(`Error deleting transaction ${req.params.id}:`, {
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({ message: 'Server xətası' });
        }
    }
};

module.exports = transactionController; 