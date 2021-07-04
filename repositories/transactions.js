const Transaction = require('../model/transaction')

const listTransaction = async () => {
  const results = await Transaction.find()
  return results
}

const addTransaction = async (body) => {
  const newTransaction = await Transaction.create(body)
  return newTransaction
}

const getTransactionById = async (transactionId) => {
  const result = await Transaction.findOne({ _id: transactionId })
  return result
}

const removeTransaction = async (transactionId) => {
  const result = await Transaction.findOneAndRemove({
    _id: transactionId,
  })
  return result
}

const updateContact = async (transactionId, body) => {
  const result = await Transaction.findOneAndUpdate(
    { _id: transactionId },
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
  updateContact,
}
