const Transaction = require('../model/transaction')

const getCategories = async (month, year, userId) => {
  const startDate = new Date(
    `${year}-${prepareMonth(month)}-01T00:00`
  ).toISOString()
  const endDate = configureEndDate(month, year).toISOString()

  const transactions = await Transaction.find({
    owner: userId,
    date: { $gte: startDate, $lt: endDate },
  }).populate({
    path: 'owner',
    select: '_id',
  }).sort({ date: 'asc' })

  const income = calculateIncome(transactions)
  const consumption = calculateConsumption(transactions)

  const consumptionTransactions = transactions.filter((el) => !el.income)
  const groupedTransactions = groupBy(consumptionTransactions, 'category')

  const categories = Object.keys(groupedTransactions).map((element) => {
    return {
      category: element,
      sum: calculateSumByCategory(groupedTransactions[element]),
    }
  })

  const latestBalanceInPeriod = transactions[transactions.length - 1]

  return {
    categories: categories,
    income: income,
    consumption: consumption,
    balance: latestBalanceInPeriod.balance,
    owner: userId,
  }
}

// ****функция для:
// если выбирают декабрь, то конечная дата периода - 1 января СЛЕДУЮЩЕГО ГОДА
const configureEndDate = (month, year) => {
  console.log(
    new Date(
      `${year}-${prepareMonth((parseInt(month) + 1).toString())}-01T00:00`
    )
  )
  if (month === '12') {
    return new Date(`${parseInt(year) + 1}-01-01T00:00`)
  } else {
    return new Date(
      `${year}-${prepareMonth((parseInt(month) + 1).toString())}-01T00:00`
    )
  }
}

// ****функция для: приведение значения месяца к нужному типу
const prepareMonth = (month) => {
  if (parseInt(month.length) === 2) {
    return month
  } else return `0${month}`
}

// ****функция для: ГРУППИРОВКИ
const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

// ****функция для расчета: суммы КАТЕГОРИИ
const calculateSumByCategory = (transactions) => {
  return transactions.reduce(
    (total, element) => (total += parseInt(element.sum)),
    0
  )
}

// ****функция для расчета: ДОХОДА
const calculateIncome = (transactions) => {
  const incomeArray = transactions.filter((el) => el.income)

  const income = incomeArray.reduce(
    (total, el) => (total += parseInt(el.sum)),
    0
  )
  return income
}

// ****функция для расчета: РАСХОДА
const calculateConsumption = (transactions) => {
  const consumptionArray = transactions.filter((el) => !el.income)
  const consumption = consumptionArray.reduce(
    (total, el) => (total += el.sum),
    0
  )
  return consumption
}

module.exports = { getCategories }
