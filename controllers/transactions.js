const Transaction = require('../repositories/transactions')
const { HttpCode } = require('../helpers/constants')

const getAll = async (req, res, next) => {
  try {
    const id = req.user.id
    const transactions = await Transaction.listTransaction(id)
    return res.json({ status: 'success', code: HttpCode.OK, transactions })
  } catch (e) {
    next(e)
  }
}

const addTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id
    const transaction = await Transaction.addTransaction(userId, req.body)
    return res.status(201).json({
      status: 'success',
      code: HttpCode.CREATED,
      transaction,
    })
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
        code: HttpCode.OK,
        message: 'Transaction deleted',
        data: { result },
      })
    }
    return res.json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    })
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
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: { result },
      })
    }
    return res.json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    })
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
        code: HttpCode.OK,
        data: { result },
      })
    }
    return res.json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    })
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
