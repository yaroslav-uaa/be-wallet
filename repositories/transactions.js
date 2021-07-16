const Transaction = require('../model/transaction')
const {
  getLatestBalance,
  calculateCurrentBalance,
  recalculateBalance,
  sortByDate,
} = require('./calculate-balance')

const listTransaction = async (userId) => {
  const results = await Transaction.find({
    owner: userId,
    category: { $ne: 'Capital' },
  }).populate({
    path: 'owner',
    select: '_id',
  })

  return sortByDate(results)
}

const addTransaction = async (userId, body) => {
  const lastTransactionBalance = await getLatestBalance(body.date, userId)
  const currentBalance = await calculateCurrentBalance(
    lastTransactionBalance,
    body
  )
  const results = await Transaction.create({
    owner: userId,
    ...body,
    balance: currentBalance,
  })
  recalculateBalance(body.date, currentBalance, userId, false)
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
  const lastTransaction = await Transaction.find({
    date: { $lte: result.date },
    owner: userId,
  })
    .sort({ date: -1 })
    .limit(1)

  if (lastTransaction.length !== 0) {
    recalculateBalance(result.date, lastTransaction[0].balance, userId, false)
  } else recalculateBalance(result.date, '0', userId, false)
  return result
}

const updateTransaction = async (userId, transactionId, body) => {
  const result = await Transaction.findOneAndUpdate(
    { _id: transactionId, owner: userId },
    { ...body },
    { new: true }
  )
  const lastTransaction = await Transaction.find({
    date: { $lt: result.date },
    owner: userId,
  })
    .sort({ date: -1 })
    .limit(1)
  if (lastTransaction.length !== 0) {
    recalculateBalance(
      lastTransaction[0].date,
      lastTransaction[0].balance,
      userId,
      false
    )
  } else recalculateBalance(result.date, '0', userId, true)
  return result
}

module.exports = {
  listTransaction,
  addTransaction,
  getTransactionById,
  removeTransaction,
  updateTransaction,
}
