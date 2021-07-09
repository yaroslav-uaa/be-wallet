const Transaction = require('../model/transaction')

//* *получение баланса с предыдущей для необходимой даты транзакции
const getLatestBalance = async (date, userId) => {
  const lastTransaction = await Transaction.find({
    date: { $lt: date },
    owner: userId,
  })
    .sort({ date: -1 })
    .limit(1)
  console.log(lastTransaction)
  if (!lastTransaction || lastTransaction.length === 0) {
    return 0
  } else return lastTransaction[0].balance
}

//* *расчет баланса добавляемой транзакции
const calculateCurrentBalance = (balance, body) => {
  if (body.income) {
    return balance + body.sum
  } else return balance - body.sum
}

//* *перерасчет баланса последующих по дате за добавляемой транзакций
const recalculateBalance = async (date, currentBalance, userId) => {
  let balance = currentBalance
  const transactions = await Transaction.find({
    date: { $gt: date },
    owner: userId,
  })
  const sortedTransactions = transactions.sort(function (a, b) {
    if (a.date > b.date) {
      return 1
    }
    if (a.date < b.date) {
      return -1
    }
    return 0
  })
  sortedTransactions.forEach((el) => {
    console.log(balance)
    balance = calculateCurrentBalance(balance, el)
    Transaction.updateOne(
      { _id: el.id },
      { balance: balance },
      function (err, docs) {
        if (err) {
          console.log(err)
        } else {
          console.log('Updated Docs : ', docs)
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
