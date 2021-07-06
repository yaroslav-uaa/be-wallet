const Transaction = require('../model/transaction')

const getCategories = async (month, year) => {
  const startDate = `${year}-${month}-01`
  const endDate = configureEndDate(month, year)
  console.log(startDate)
  console.log(endDate)
  const result = await Transaction.find({
    date: { $gte: startDate, $lt: endDate },
  })
  return result
}
// TODO: узнать  0 или 1 январь в дате при выборе в статистике
// ****функция для расчета:
// если выбирают декабрь, то конечная дата периода - 1 января СЛЕДУЮЩЕГО ГОДА
const configureEndDate = (month, year) => {
  if (month === '12') {
    return `${parseInt(year) + 1}-01-01`
  } else {
    return `${year}-${parseInt(month) + 1}-01`
  }
}

module.exports = { getCategories }
