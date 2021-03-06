const Transaction = require('../model/transaction')

//* *получение баланса транзакции предыдущей  для необходимой даты транзакции
const getLatestBalance = async (date, userId) => {
  const lastTransaction = await Transaction.find({
    date: { $lt: date },
    owner: userId,
  })
    .sort({ date: -1 })
    .limit(1)
  if (!lastTransaction || lastTransaction.length === 0) {
    return 0
  } else return lastTransaction[0].balance
}

//* *расчет баланса добавляемой транзакции
const calculateCurrentBalance = (balance, body) => {
  if (body.income) {
    return parseInt(balance + body.sum)
  } else return parseInt(balance - body.sum)
}

//* *перерасчет баланса последующих по дате за добавляемой транзакций
const recalculateBalance = async (
  date,
  currentBalance,
  userId,
  isLatestTransaction
) => {
  let balance = currentBalance
  const transactions = await Transaction.find({
    date: isLatestTransaction ? { $gte: date } : { $gt: date },
    owner: userId,
  }).sort({ date: 'asc' })

  await transactions.forEach(async (el) => {
    balance = calculateCurrentBalance(balance, el)
    await Transaction.updateOne(
      { _id: el.id },
      { balance: balance },
      function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('Success update')
        }
      }
    )
  })
}

module.exports = {
  getLatestBalance,
  calculateCurrentBalance,
  recalculateBalance,
}
