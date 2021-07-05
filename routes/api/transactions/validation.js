const Joi = require('joi')
const mongoose = require('mongoose')

const schemaCreateTransaction = Joi.object({
  date: Joi.string().required(),
  category: Joi.string().required(),
  income: Joi.boolean().required(),
  comment: Joi.string().optional(),
  sum: Joi.number().min(0).integer().required(),
})

const schemaUpdateTransaction = Joi.object({
  date: Joi.string().optional(),
  category: Joi.string().optional(),
  income: Joi.boolean().optional(),
  comment: Joi.string().optional(),
  sum: Joi.number().min(0).integer().optional(),
}).or('date', 'category', 'income', 'comment', 'sum')

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj)
    next()
  } catch (err) {
    next({
      status: 400,
      message: err.message.replace(/"/g, ''),
    })
  }
}

module.exports = {
  validationCreateTransaction: (req, res, next) => {
    return validate(schemaCreateTransaction, req.body, next)
  },
  validationUpdateTransaction: (req, res, next) => {
    return validate(schemaUpdateTransaction, req.body, next)
  },
}
