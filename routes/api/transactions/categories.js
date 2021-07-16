const express = require('express')
const router = express.Router()
const guard = require('../../../helpers/guard')

const controllerCategories = require('../../../controllers/categories')
const controllerCapital = require('../../../controllers/capital')

router
  .get('/', guard, controllerCategories.getCategories)
  .post('/', guard, controllerCapital.addCapital)

module.exports = router
