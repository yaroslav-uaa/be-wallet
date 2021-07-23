const express = require('express')
const router = express.Router()
const guard = require('../../../helpers/guard')

const controllerCategories = require('../../../controllers/categories')

router.get('/', guard, controllerCategories.getCategories)

module.exports = router
