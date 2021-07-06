const Transaction = require('../model/transaction')

const getCategories = async (month, year) => {
  const startDate = `${year}-${month}-01`
  const endDate = configureEndDate(month, year)

  const transactions = await Transaction.find({
    date: { $gte: startDate, $lt: endDate },
  })

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
  return {
    categories: categories,
    income: income,
    consumption: consumption,
    balance: income - consumption,
  }
}

// TODO: узнать  0 или 1 январь в дате при выборе в статистике
// ****функция для:
// если выбирают декабрь, то конечная дата периода - 1 января СЛЕДУЮЩЕГО ГОДА
const configureEndDate = (month, year) => {
  if (month === '12') {
    return `${parseInt(year) + 1}-01-01`
  } else {
    return `${year}-${parseInt(month) + 1}-01`
  }
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
