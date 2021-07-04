const fs = require('fs/promises')
const path = require('path')
const { v4: id } = require('uuid')

const transacPath = path.join(__dirname, 'transaction.json')

const readTransaction = async () => {
  const transaсtions = await fs.readFile(transacPath, 'utf-8')
  return JSON.parse(transaсtions)
}

const listTransaction = async () => {
  return await readTransaction()
}

const getTransactionsById = async (transactionId) => {
  const transaсtions = await readTransaction()
  transaсtions.find((el) => String(transactionId) === String(el.id))
}

const removeTransaction = async (transactionId) => {}

const addTransaction = async (body) => {}

const updateTransaction = async (transactionId, body) => {}

module.exports = {
  listTransaction,
  getTransactionsById,
  removeTransaction,
  addTransaction,
  updateTransaction,
}
