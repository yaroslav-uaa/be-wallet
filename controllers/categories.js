const Categories = require('../repositories/categories')

const getCategories = async (req, res, next) => {
  try {
    const { month, year } = req.query
    const result = await Categories.getCategories(month, year)
    return res.json({ status: 'success', code: 200, data: { result } })
  } catch (e) {
    next(e)
  }
}

module.exports = { getCategories }
