const Transaction = require('../repositories/transactions')

const getAll = async (_req, res, next) => {
  try {
    const result = await Transaction.listTransaction()
    return res.json({ status: 'success', code: 200, data: { result } })
  } catch (e) {
    next(e)
  }
}

const addTransaction = async (req, res, next) => {
  try {
    const contact = await Transaction.addTransaction(req.body)
    return res
      .status(201)
      .json({ status: 'success', code: 201, data: { contact } })
  } catch (e) {
    next(e)
  }
}

const removeTransaction = async (req, res, next) => {
  try {
    const result = await Transaction.removeTransaction(req.params.transactionId)
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
}

const getTransactionById = async (req, res, next) => {
  try {
    const result = await Transaction.getTransactionById(
      req.params.transactionId
    )
    if (result) {
      console.log(result)
      return res.json({ status: 'success', code: 200, data: { result } })
    }
    return res.json({ status: 'error', code: 404, message: 'Not found' })
  } catch (e) {
    next(e)
  }
}

const updateTransaction = async (req, res, next) => {
  try {
    const result = await Transaction.updateTransaction(
      req.params.transactionId,
      req.body
    )
    if (result) {
      return res.json({
        status: 'success',
        code: 200,
        data: { result },
      })
    }
    return res.json({ status: 'error', code: 404, message: 'Not found' })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  getAll,
  addTransaction,
  removeTransaction,
  getTransactionById,
  updateTransaction,
}
