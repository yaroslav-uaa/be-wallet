const express = require('express')
const router = express.Router()
const ctrlUser = require('../../../controllers/users')
const guard = require('../../../helpers/guard')
const { validateSignInUser, validationSignUpUser } = require('./validation')

router.post('/signup', validationSignUpUser, ctrlUser.signUpUser)
router.post('/signin', validateSignInUser, ctrlUser.signIn)
router.post('/signout', guard, ctrlUser.signOut)

router.get('/current', guard, ctrlUser.currentUser)

module.exports = router
