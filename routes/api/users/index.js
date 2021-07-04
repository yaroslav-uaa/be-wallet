const express = require('express')
const router = express.Router()
const ctrlUser = require('../../../controllers/users')

router.post('/signup', ctrlUser.signUpUser)
router.post('/signin', ctrlUser.signIn)
router.post('/signout', ctrlUser.signOut)

router.get('/current', ctrlUser.currentUser)

module.exports = router
