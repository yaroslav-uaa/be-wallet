const Capital = require('../repositories/capital')
const { HttpCode } = require('../helpers/constants')

const addCapital = async (req, res, next) => {
  try {
    const userId = req.user.id
    const capital = await Capital.addCapital(userId, req.body)
    return res.status(201).json({
      status: 'success',
      code: HttpCode.CREATED,
      capital,
    })
  } catch (e) {
    next(e)
  }
}

const getCapital = async (req, res, next) => {
  try {
    const userId = req.user.id
    const capital = await Capital.getCapital(userId)
    return res.status(201).json({
      status: 'success',
      code: HttpCode.CREATED,
      capital,
    })
  } catch (e) {
    next(e)
  }
}

module.exports = { addCapital, getCapital }
