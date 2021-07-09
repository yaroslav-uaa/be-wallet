const Categories = require('../repositories/categories')

const getCategories = async (req, res, next) => {
  try {
    const { month, year } = req.query
    const transactionsCategories = await Categories.getCategories(month, year)
    return res.json({
      status: 'success',
      code: 200,
      data: { transactionsCategories },
    })
  } catch (e) {
    next(e)
  }
}

module.exports = { getCategories }
