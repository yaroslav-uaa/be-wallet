const express = require('express')
const router = express.Router()
const controllers = require('../../controllers/transactions')
const guard = require('../../helpers/guard')

router
  .get('/', guard, controllers.getAll)
  .post('/', guard, controllers.addTransaction)

router
  .get('/:transactionId', guard, controllers.getTransactionById)
  .delete('/:transactionId', guard, controllers.removeTransaction)
  .put('/:transactionId', guard, controllers.updateTransaction)

// TODO: add PATCH request

module.exports = router
