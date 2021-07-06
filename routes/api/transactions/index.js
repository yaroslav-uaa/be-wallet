const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/transactions')
const guard = require('../../../helpers/guard')
const {
  validationCreateTransaction,
  validationUpdateTransaction,
  validateMongoId,
} = require('./validation')

router
  .get('/', guard, controllers.getAll)
  .post('/', guard, validationCreateTransaction, controllers.addTransaction)

router
  .get('/:transactionId', guard, controllers.getTransactionById)
  .delete('/:transactionId', guard, controllers.removeTransaction)
  .put(
    '/:transactionId',
    guard,
    validationUpdateTransaction,
    validateMongoId,
    controllers.updateTransaction
  )

// TODO: add PATCH request

module.exports = router
