const Transaction = require('../model/transaction')
const {
  getLatestBalance,
  calculateCurrentBalance,
  recalculateBalance,
} = require('../helpers/calculate-balance')

const listTransaction = async (userId) => {
  const results = await Transaction.find({ owner: userId }).populate({
    path: 'owner',
    select: 'email -_id',
  })
  return results
}

const addTransaction = async (userId, body) => {
  const lastTransactionBalance = await getLatestBalance(body.date, userId)
  console.log(lastTransactionBalance)
  const currentBalance = await calculateCurrentBalance(
    lastTransactionBalance,
    body
  )
  const results = await Transaction.create({
    owner: userId,
    ...body,
    balance: currentBalance,
  })
  recalculateBalance(body.date, currentBalance, userId)
  return results
}

const getTransactionById = async (userId, transactionId) => {
  const result = await Transaction.findOne({
    _id: transactionId,
    owner: userId,
  })
  return result
}

const removeTransaction = async (userId, transactionId) => {
  const result = await Transaction.findOneAndDelete({
    _id: transactionId,
    owner: userId,
  })
  return result
}

const updateTransaction = async (userId, transactionId, body) => {
  const result = await Transaction.findOneAndUpdate(
    { _id: transactionId, owner: userId },
    { ...body },
    { new: true }
  )
  return result
}

module.exports = {
  listTransaction,
  addTransaction,
  getTransactionById,
  removeTransaction,
  updateTransaction,
}
