const Order = require('../models/order.model');
const logger = require('../utils/logger');

const orderController = {
  // Get all pending orders for baza
  async getPendingOrders(req, res) {
    try {
      logger.info('Fetching all pending orders');
      
      const orders = await Order.getPendingOrders();
      
      logger.info(`Found ${orders.length} pending orders`);
      res.json(orders);
    } catch (error) {
      logger.error('Error fetching pending orders:', {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  },

  // Get order by ID
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      logger.info(`Fetching order with ID: ${id}`);
      
      const order = await Order.getOrderById(id);

      if (!order) {
        logger.warn(`Order with ID ${id} not found`);
        return res.status(404).json({ message: 'Sifariş tapılmadı' });
      }

      res.json(order);
    } catch (error) {
      logger.error(`Error fetching order ${req.params.id}:`, {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  },

  // Create new order
  async createOrder(req, res) {
    try {
      const { marketId, items } = req.body;
      
      if (!marketId || !items || !items.length) {
        return res.status(400).json({ message: 'Market ID və məhsullar tələb olunur' });
      }
      
      logger.info(`Creating new order for market ID: ${marketId} with ${items.length} items`);
      
      // Create the order
      const orderId = await Order.createOrder(marketId);
      
      // Add order items
      for (const item of items) {
        await Order.addOrderItem(
          orderId,
          item.productId,
          item.quantity,
          item.price || 0
        );
      }

      // Get the created order with items
      const createdOrder = await Order.getOrderById(orderId);
      
      logger.info(`Order created with ID: ${orderId}`);
      res.status(201).json(createdOrder);
    } catch (error) {
      logger.error('Error creating order:', {
        error: error.message,
        stack: error.stack,
        body: req.body
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  },

  // Baza approve order
  async approveOrder(req, res) {
    try {
      const { id } = req.params;
      const { items } = req.body;
      
      if (!items || !items.length) {
        return res.status(400).json({ message: 'Təsdiq üçün məhsullar tələb olunur' });
      }
      
      logger.info(`Approving order with ID: ${id}`);
      
      // Get the order to verify it exists
      const order = await Order.getOrderById(id);
      
      if (!order) {
        logger.warn(`Order with ID ${id} not found`);
        return res.status(404).json({ message: 'Sifariş tapılmadı' });
      }
      
      // Update the order items with received quantities and prices
      let totalAmount = 0;
      
      for (const item of items) {
        await Order.updateOrderItemReceivedQuantity(
          item.id,
          item.receivedQuantity,
          item.price
        );
        totalAmount += (item.receivedQuantity * item.price);
      }
      
      // Create a baza order record
      const bazaOrderId = await Order.createBazaOrder(id, totalAmount);
      
      logger.info(`Order ${id} approved successfully. Baza order ID: ${bazaOrderId}`);
      res.json({ 
        message: 'Sifariş təsdiq edildi',
        orderId: id,
        bazaOrderId,
        totalAmount
      });
    } catch (error) {
      logger.error(`Error approving order ${req.params.id}:`, {
        error: error.message,
        stack: error.stack,
        body: req.body
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  },

  // Get market orders
  async getMarketOrders(req, res) {
    try {
      const { marketId } = req.params;
      logger.info(`Fetching orders for market ID: ${marketId}`);
      
      const orders = await Order.getOrdersByMarketId(marketId);
      
      logger.info(`Found ${orders.length} orders for market ID: ${marketId}`);
      res.json(orders);
    } catch (error) {
      logger.error(`Error fetching orders for market ${req.params.marketId}:`, {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  },
  
  // Clear all pending orders
  async clearAllOrders(req, res) {
    try {
      logger.info('Clearing all pending orders from database');
      
      const result = await Order.clearAllPendingOrders();
      
      logger.info(`Successfully cleared ${result.deletedCount} pending orders`);
      
      res.json({ 
        success: true,
        message: `${result.deletedCount} sifariş silindi`,
        deletedCount: result.deletedCount,
        orderIds: result.orderIds
      });
    } catch (error) {
      logger.error('Error clearing all orders:', {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({ message: 'Server xətası' });
    }
  }
};

module.exports = orderController; 