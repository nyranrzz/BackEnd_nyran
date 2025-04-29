const db = require('../config/db');
const logger = require('../utils/logger');

class Order {
  // Get all pending orders for baza approval
  static async getPendingOrders() {
    try {
      const [orders] = await db.query(`
        SELECT mo.id, mo.market_id, u.name as market_name, mo.status, mo.created_at
        FROM market_orders mo
        JOIN users u ON mo.market_id = u.id
        WHERE mo.status = 'pending'
        ORDER BY mo.created_at DESC
      `);
      return orders;
    } catch (error) {
      logger.error('Error getting pending orders:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Get order by ID with order items
  static async getOrderById(orderId) {
    try {
      // Get order details
      const [orders] = await db.query(`
        SELECT mo.id, mo.market_id, u.name as market_name, mo.status, mo.created_at
        FROM market_orders mo
        JOIN users u ON mo.market_id = u.id
        WHERE mo.id = ?
      `, [orderId]);

      if (orders.length === 0) {
        return null;
      }

      // Get order items
      const [items] = await db.query(`
        SELECT moi.id, moi.product_id, p.name as product_name, 
               moi.requested_quantity, moi.received_quantity, 
               moi.price, moi.total
        FROM market_order_items moi
        JOIN products p ON moi.product_id = p.id
        WHERE moi.order_id = ?
      `, [orderId]);

      return {
        ...orders[0],
        items
      };
    } catch (error) {
      logger.error(`Error getting order ${orderId}:`, {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Create a new order
  static async createOrder(marketId) {
    try {
      const [result] = await db.query(`
        INSERT INTO market_orders (market_id, status)
        VALUES (?, 'pending')
      `, [marketId]);

      return result.insertId;
    } catch (error) {
      logger.error('Error creating order:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Add item to order
  static async addOrderItem(orderId, productId, requestedQuantity, price) {
    try {
      const total = requestedQuantity * price;
      
      const [result] = await db.query(`
        INSERT INTO market_order_items (order_id, product_id, requested_quantity, price, total)
        VALUES (?, ?, ?, ?, ?)
      `, [orderId, productId, requestedQuantity, price, total]);

      return result.insertId;
    } catch (error) {
      logger.error('Error adding order item:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(orderId, status) {
    try {
      await db.query(`
        UPDATE market_orders
        SET status = ?
        WHERE id = ?
      `, [status, orderId]);

      return true;
    } catch (error) {
      logger.error(`Error updating order ${orderId} status:`, {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Update order item received quantity
  static async updateOrderItemReceivedQuantity(itemId, receivedQuantity, price) {
    try {
      const total = receivedQuantity * price;
      
      await db.query(`
        UPDATE market_order_items
        SET received_quantity = ?, total = ?
        WHERE id = ?
      `, [receivedQuantity, total, itemId]);

      return true;
    } catch (error) {
      logger.error(`Error updating order item ${itemId}:`, {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Get orders by market ID
  static async getOrdersByMarketId(marketId) {
    try {
      const [orders] = await db.query(`
        SELECT mo.id, mo.status, mo.created_at,
               (SELECT SUM(moi.total) FROM market_order_items moi WHERE moi.order_id = mo.id) as total_amount
        FROM market_orders mo
        WHERE mo.market_id = ?
        ORDER BY mo.created_at DESC
      `, [marketId]);

      return orders;
    } catch (error) {
      logger.error(`Error getting orders for market ${marketId}:`, {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Create a baza-approved order
  static async createBazaOrder(marketOrderId, totalAmount) {
    try {
      const [result] = await db.query(`
        INSERT INTO baza_orders (market_order_id, total_amount, status)
        VALUES (?, ?, 'pending')
      `, [marketOrderId, totalAmount]);

      // Update market order status
      await db.query(`
        UPDATE market_orders
        SET status = 'approved'
        WHERE id = ?
      `, [marketOrderId]);

      return result.insertId;
    } catch (error) {
      logger.error(`Error creating baza order for market order ${marketOrderId}:`, {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
  
  // Clear all pending orders from database
  static async clearAllPendingOrders() {
    try {
      // First get all pending orders to log their IDs
      const [pendingOrders] = await db.query(`
        SELECT id FROM market_orders WHERE status = 'pending'
      `);
      
      const pendingOrderIds = pendingOrders.map(order => order.id);
      logger.info(`Clearing ${pendingOrders.length} pending orders: ${pendingOrderIds.join(', ')}`);
      
      // Delete all items from orders with status 'pending'
      await db.query(`
        DELETE moi FROM market_order_items moi
        JOIN market_orders mo ON moi.order_id = mo.id
        WHERE mo.status = 'pending'
      `);
      
      // Now delete the orders themselves
      const [result] = await db.query(`
        DELETE FROM market_orders
        WHERE status = 'pending'
      `);
      
      logger.info(`Successfully deleted ${result.affectedRows} pending orders`);
      
      return {
        deletedCount: result.affectedRows,
        orderIds: pendingOrderIds
      };
    } catch (error) {
      logger.error('Error clearing pending orders:', {
        error: error.message,
        stack: error.stack,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      });
      throw error;
    }
  }

  // Save baza prices for a product
  static async saveBazaPrice(productId, price, weight, total, grandTotal) {
    try {
      // Check if price already exists for this product
      const [existingPrices] = await db.query(`
        SELECT id FROM baza_prices WHERE product_id = ?
      `, [productId]);
      
      if (existingPrices.length > 0) {
        // Update existing price
        await db.query(`
          UPDATE baza_prices
          SET price = ?, weight = ?, total = ?, grand_total = ?, updated_at = CURRENT_TIMESTAMP
          WHERE product_id = ?
        `, [price, weight, total, grandTotal, productId]);
        return existingPrices[0].id;
      } else {
        // Insert new price
        const [result] = await db.query(`
          INSERT INTO baza_prices (product_id, price, weight, total, grand_total)
          VALUES (?, ?, ?, ?, ?)
        `, [productId, price, weight, total, grandTotal]);
        return result.insertId;
      }
    } catch (error) {
      logger.error('Error saving baza price:', {
        error: error.message,
        stack: error.stack,
        productId, price, weight, total, grandTotal
      });
      throw error;
    }
  }
  
  // Get all baza prices
  static async getBazaPrices() {
    try {
      const [prices] = await db.query(`
        SELECT bp.id, bp.product_id, p.name as product_name, 
               bp.price, bp.weight, bp.total, bp.grand_total, bp.updated_at
        FROM baza_prices bp
        JOIN products p ON bp.product_id = p.id
        ORDER BY p.name
      `);
      return prices;
    } catch (error) {
      logger.error('Error getting baza prices:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
  
  // Clear all baza prices
  static async clearBazaPrices() {
    try {
      const [result] = await db.query(`
        DELETE FROM baza_prices
      `);
      
      return {
        deletedCount: result.affectedRows
      };
    } catch (error) {
      logger.error('Error clearing baza prices:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
  
  // Calculate total baza amount
  static async getTotalBazaAmount() {
    try {
      const [result] = await db.query(`
        SELECT SUM(grand_total) as total_amount FROM baza_prices
      `);
      
      return result[0].total_amount || 0;
    } catch (error) {
      logger.error('Error calculating total baza amount:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}

module.exports = Order; 