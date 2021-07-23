const Transaction = require('../model/transaction')
const { recalculateBalance } = require('./calculate-balance')

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
    await recalculateBalance(capital.date, '0', userId, true)
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
      },
      { new: true }
    )
    await recalculateBalance(capital.date, '0', userId, true)
  }
  return capital
}

const getCapital = async (userId) => {
  const result = await Transaction.findOne({
    owner: userId,
    category: 'Capital',
  }).populate({
    path: 'owner',
    select: '_id',
  })
  return result
}

module.exports = { addCapital, getCapital }
