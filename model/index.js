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

const getTransactionById = async (transactionId) => {
  const transaсtions = await readTransaction()
  return transaсtions.find((el) => String(transactionId) === String(el.id))
}

const removeTransaction = async (transactionId) => {
  const transaсtions = await readTransaction()
  const deletedTransaction = transaсtions.find(
    (el) => String(transactionId) === String(el.id)
  )
  if (deletedTransaction) {
    const index = transaсtions.indexOf(deletedTransaction)
    transaсtions.splice(index, 1)

    await fs.writeFile(transacPath, JSON.stringify(transaсtions))
    return deletedTransaction
  }
  return null
}

const addTransaction = async (body) => {
  const newTransaction = {
    id: id(),
    // TODO: add data?,
    ...body,
  }
  const transaсtions = await readTransaction()
  transaсtions.push(newTransaction)
  await fs.writeFile(transacPath, JSON.stringify(transaсtions))
  return newTransaction
}

const updateTransaction = async (transactionId, body) => {
  const transaсtions = await readTransaction()
  const [result] = transaсtions.filter(
    (el) => String(transactionId) === String(el.id)
  )

  if (result) {
    Object.assign(result, body)
    await fs.writeFile(transacPath, JSON.stringify(transaсtions))
  }

  return result
}

module.exports = {
  listTransaction,
  getTransactionById,
  removeTransaction,
  addTransaction,
  updateTransaction,
}
