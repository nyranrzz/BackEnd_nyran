const validateTransaction = (req, res, next) => {
  const { marketId, totalAmount, paidAmount, remainingAmount, status } = req.body;

  // Check if required fields are present
  if (!marketId || !totalAmount || !paidAmount || !remainingAmount || !status) {
    return res.status(400).json({
      error: 'Missing required fields: marketId, totalAmount, paidAmount, remainingAmount, and status are required'
    });
  }

  // Validate numeric fields
  if (isNaN(totalAmount) || isNaN(paidAmount) || isNaN(remainingAmount)) {
    return res.status(400).json({
      error: 'totalAmount, paidAmount, and remainingAmount must be numeric values'
    });
  }

  // Validate positive numbers
  if (totalAmount < 0 || paidAmount < 0 || remainingAmount < 0) {
    return res.status(400).json({
      error: 'totalAmount, paidAmount, and remainingAmount must be positive numbers'
    });
  }

  // Validate that paid amount doesn't exceed total amount
  if (paidAmount > totalAmount) {
    return res.status(400).json({
      error: 'paidAmount cannot be greater than totalAmount'
    });
  }

  // Validate that remaining amount equals total amount minus paid amount
  const calculatedRemaining = totalAmount - paidAmount;
  if (Math.abs(remainingAmount - calculatedRemaining) > 0.01) { // Using small epsilon for floating point comparison
    return res.status(400).json({
      error: 'remainingAmount must equal totalAmount minus paidAmount'
    });
  }

  // Validate status
  const validStatuses = ['pending', 'completed', 'cancelled'];
  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({
      error: 'Invalid status. Must be one of: pending, completed, cancelled'
    });
  }

  // If all validations pass, proceed to the next middleware
  next();
};

module.exports = validateTransaction; 