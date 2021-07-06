const express = require('express')
const router = express.Router()

const controllerCategories = require('../../../controllers/categories')

router.get('/', controllerCategories.getCategories)

// TODO: add PATCH request

module.exports = router
