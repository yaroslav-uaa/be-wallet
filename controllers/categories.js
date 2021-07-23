const Categories = require('../repositories/categories')
const { HttpCode } = require('../helpers/constants')

const getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { month, year } = req.query
    const { categories, income, consumption, balance } =
      await Categories.getCategories(month, year, userId)

    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        categories,
        income,
        consumption,
        balance,
      },
    })
  } catch (e) {
    next(e)
  }
}

module.exports = { getCategories }
