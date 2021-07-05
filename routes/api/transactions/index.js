const express = require('express')
const router = express.Router()
const controllers = require('../../../controllers/transactions')

router.get('/', controllers.getAll).post('/', controllers.addTransaction)

router
  .get('/:transactionId', controllers.getTransactionById)
  .delete('/:transactionId', controllers.removeTransaction)
  .put('/:transactionId', controllers.updateTransaction)

// TODO: add PATCH request

module.exports = router
