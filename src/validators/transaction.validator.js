const Joi = require('joi');

const transactionSchema = Joi.object({
  marketId: Joi.number().integer().required(),
  totalAmount: Joi.number().precision(2).required(),
  paidAmount: Joi.number().precision(2).required(),
  remainingAmount: Joi.number().precision(2).required(),
  status: Joi.string().valid('pending', 'completed', 'cancelled').required(),
  notes: Joi.string().allow('', null),
  date: Joi.date().default(Date.now)
});

exports.validateTransaction = (transaction) => {
  return transactionSchema.validate(transaction, { abortEarly: false });
}; 