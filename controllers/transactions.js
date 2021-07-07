const Transaction = require('../repositories/transactions')

const getAll = async (req, res, next) => {
  try {
    const id = req.user.id
    const result = await Transaction.listTransaction(id)
    return res.json({ status: 'success', code: 200, data: { result } })
  } catch (e) {
    next(e)
  }
}
// TODO: add calculate
const addTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id
    const transaction = await Transaction.addTransaction(userId, req.body)
    return res
      .status(201)
      .json({ status: 'success', code: 201, data: { transaction } })
  } catch (e) {
    next(e)
  }
}

const removeTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id
    const result = await Transaction.removeTransaction(
      userId,
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
}

const getTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const result = await Transaction.getTransactionById(
      userId,
      req.params.transactionId
    )
    if (result) {
      return res.json({ status: 'success', code: 200, data: { result } })
    }
    return res.json({ status: 'error', code: 404, message: 'Not found' })
  } catch (e) {
    next(e)
  }
}

const updateTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id
    const result = await Transaction.updateTransaction(
      userId,
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
