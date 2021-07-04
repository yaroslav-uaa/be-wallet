const Transaction = require('../model/transaction')

const listTransaction = async () => {
  const results = await Transaction.find()
  return results
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
