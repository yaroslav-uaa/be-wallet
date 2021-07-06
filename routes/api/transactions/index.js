const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/transactions')

const {
  validationCreateTransaction,
  validationUpdateTransaction,
  validateMongoId,
} = require('./validation')

router
  .get('/', controllers.getAll)
  .post('/', validationCreateTransaction, controllers.addTransaction)

router
  .get('/:transactionId', controllers.getTransactionById)
  .delete('/:transactionId', controllers.removeTransaction)
  .put(
    '/:transactionId',
    validationUpdateTransaction,
    validateMongoId,
    controllers.updateTransaction
  )

module.exports = router
