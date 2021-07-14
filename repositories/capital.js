const Transaction = require('../model/transaction')
const { recalculateBalance } = require('../helpers/calculate-balance')

const addCapital = async (userId, body) => {
  const initialCapital = await Transaction.find({ category: 'Capital' })
  let capital
  if (initialCapital.length === 0) {
    capital = await Transaction.create({
      date: new Date(0).toISOString(),
      category: 'Capital',
      income: true,
      comment: 'Start capital',
      sum: body.sum,
      balance: body.sum,
      owner: userId,
    })
    console.log(`new ${capital}`)
    recalculateBalance(capital.date, '0', userId, true)
  } else {
    capital = await Transaction.findOneAndReplace(
      { _id: initialCapital[0].id },
      {
        date: new Date(0).toISOString(),
        category: 'Capital',
        income: true,
        comment: 'Start capital',
        sum: body.sum,
        balance: body.sum,
        owner: userId,
      }
    )
    console.log(`overwrite ${capital}`)
    recalculateBalance(capital.date, '0', userId, true)
  }
  return capital
}

module.exports = { addCapital }
