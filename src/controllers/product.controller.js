const db = require('../config/db');
const logger = require('../utils/logger');

const productController = {
    // Get all products
    async getAllProducts(req, res) {
        try {
            logger.info('Fetching all products');
            
            const [products] = await db.query(
                'SELECT id, name FROM products WHERE status = true ORDER BY name ASC'
            );
            
            logger.info(`Found ${products.length} products`);
            res.json(products);
        } catch (error) {
            logger.error('Error in getAllProducts:', {
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

    // Get product by ID
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            
            const [product] = await db.query(
                'SELECT id, name FROM products WHERE id = ? AND status = true',
                [id]
            );

            if (!product.length) {
                return res.status(404).json({ message: 'Məhsul tapılmadı' });
            }

            res.json(product[0]);
        } catch (error) {
            logger.error(`Error fetching product ${req.params.id}:`, error);
            res.status(500).json({ message: 'Server xətası' });
        }
    }
};

module.exports = productController; 