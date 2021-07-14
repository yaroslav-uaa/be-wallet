const express = require('express')
const router = express.Router()
const guard = require('../../../helpers/guard')

const controllerCapital = require('../../../controllers/capital')

router.post('/', guard, controllerCapital.addCapital)

module.exports = router
