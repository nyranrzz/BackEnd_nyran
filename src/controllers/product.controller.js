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
    },

    // Create new product
    async createProduct(req, res) {
        try {
            const { name } = req.body;
            
            logger.info(`Received request to create product. Body: ${JSON.stringify(req.body)}`);
            logger.info(`Request user: ${JSON.stringify(req.user)}`);
            
            if (!name || name.trim() === '') {
                logger.warn('Product name is empty or missing');
                return res.status(400).json({ message: 'Məhsul adı tələb olunur' });
            }
            
            // Sanitize the product name - remove extra spaces and limit length
            const sanitizedName = name.trim().replace(/\s+/g, ' ').slice(0, 255);
            
            logger.info(`Creating new product with name: "${sanitizedName}"`);
            
            // Use database defaults for status and created_at
            const query = 'INSERT INTO products (name) VALUES (?)';
            logger.info(`Executing SQL query: ${query} with params: ["${sanitizedName}"]`);
            
            const [result] = await db.query(
                query,
                [sanitizedName]
            );
            
            // Fetch the newly created product to verify it was saved correctly
            const [newProduct] = await db.query(
                'SELECT id, name, status, created_at FROM products WHERE id = ?',
                [result.insertId]
            );
            
            logger.info(`Product created with ID: ${result.insertId}, details:`, newProduct[0]);
            
            res.status(201).json({
                success: true,
                id: result.insertId,
                name: sanitizedName,
                status: true,
                created_at: new Date().toISOString(),
                message: 'Məhsul uğurla yaradıldı'
            });
        } catch (error) {
            logger.error('Error creating product:', {
                error: error.message,
                stack: error.stack,
                code: error.code,
                sqlMessage: error.sqlMessage,
                body: req.body
            });
            
            // Check for duplicate entry error
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Bu adla məhsul artıq mövcuddur' });
            }
            
            res.status(500).json({ message: `Server xətası: ${error.message}` });
        }
    }
};

module.exports = productController; 