const Transaction = require('../model/transaction')
const {
  getLatestBalance,
  calculateCurrentBalance,
  recalculateBalance,
} = require('./calculate-balance')

const listTransaction = async (userId) => {
  const results = await Transaction.find({
    owner: userId,
    category: { $ne: 'Capital' },
  })
    .populate({
      path: 'owner',
      select: '_id',
    })
    .sort({ date: -1 })

  return results
}

const addTransaction = async (userId, body) => {
  const lastTransactionBalance = await getLatestBalance(body.date, userId)
  const currentBalance = await calculateCurrentBalance(
    lastTransactionBalance,
    body
  )
  await Transaction.create({
    owner: userId,
    ...body,
    balance: currentBalance,
  })
  await recalculateBalance(body.date, currentBalance, userId, false)
  const results = await listTransaction(userId)
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
    console.log('removeTransaction length > 0')
    await recalculateBalance(
      result.date,
      lastTransaction[0].balance,
      userId,
      false
    )
  } else {
    console.log('removeTransaction length === 0')
    await recalculateBalance(result.date, '0', userId, false)
  }

  const results = await listTransaction(userId)
  return results
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
    await recalculateBalance(
      lastTransaction[0].date,
      lastTransaction[0].balance,
      userId,
      false
    )
  } else await recalculateBalance(result.date, '0', userId, true)
  const results = await listTransaction(userId)
  return results
}

module.exports = {
  listTransaction,
  addTransaction,
  getTransactionById,
  removeTransaction,
  updateTransaction,
}
