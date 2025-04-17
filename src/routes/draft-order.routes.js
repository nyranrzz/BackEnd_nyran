const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const draftOrderController = require('../controllers/draft-order.controller');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Save draft orders - market users only
router.post('/', authorize('market'), draftOrderController.saveDrafts);

// Get draft orders for a market - market can only access their own drafts
router.get('/market/:marketId', async (req, res, next) => {
  // Check if user is allowed to access this market's drafts
  const { marketId } = req.params;
  
  // Allow admin and baza roles to access any market's drafts
  if (['admin', 'baza'].includes(req.user.role)) {
    return next();
  }
  
  // Market users can only access their own drafts
  if (req.user.role === 'market' && parseInt(req.user.userId) !== parseInt(marketId)) {
    return res.status(403).json({ 
      message: 'Bu marketin sifarişlərinə baxmaq üçün icazəniz yoxdur' 
    });
  }
  
  next();
}, draftOrderController.getMarketDrafts);

// Clear all draft orders for a market
router.delete('/market/:marketId', async (req, res, next) => {
  // Check if user is allowed to clear this market's drafts
  const { marketId } = req.params;
  
  // Allow admin and baza roles to clear any market's drafts
  if (['admin', 'baza'].includes(req.user.role)) {
    return next();
  }
  
  // Market users can only clear their own drafts
  if (req.user.role === 'market' && parseInt(req.user.userId) !== parseInt(marketId)) {
    return res.status(403).json({ 
      message: 'Bu marketin sifarişlərini silmək üçün icazəniz yoxdur' 
    });
  }
  
  next();
}, draftOrderController.clearMarketDrafts);

module.exports = router; 