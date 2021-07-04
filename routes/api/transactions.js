const express = require('express')
const router = express.Router()
const Transactions = require('../../model')

router.get('/', async (req, res, next) => {
  try {
    const result = await Transactions.listTransaction()
    return res.json({ status: 'success', code: 200, data: { result } })
  } catch (e) {
    next(e)
  }
})

router.get('/:transactionId', async (req, res, next) => {
  try {
    const result = await Transactions.getTransactionById(
      req.params.transactionId
    )
    if (result) {
      return res.json({ status: 'success', code: 200, data: { result } })
    }
    return res.json({ status: 'error', code: 404, message: 'Not found' })
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const transaction = await Transactions.addTransaction(req.body)
    return res
      .status(201)
      .json({ status: 'success', code: 201, data: { transaction } })
  } catch (e) {
    next(e)
  }
})

router.delete('/:transactionId', async (req, res, next) => {
  try {
    const result = await Transactions.removeTransaction(
      req.params.transactionId
    )
    if (result) {
      return res.json({
        status: 'success',
        code: 200,
        message: 'Transaction deleted',
        data: { result },
      })
    }
    return res.json({ status: 'error', code: 404, message: 'Not found' })
  } catch (e) {
    next(e)
  }
})

router.patch('/:transactionId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
