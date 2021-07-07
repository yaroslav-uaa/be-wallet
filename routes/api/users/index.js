const express = require('express')
const router = express.Router()
const ctrlUser = require('../../../controllers/users')
const guard = require('../../../helpers/guard')
const upload = require('../../../helpers/upload')
const { validateSignInUser, validationSignUpUser } = require('./validation')

router.post('/signup', validationSignUpUser, ctrlUser.signUpUser)
router.post('/signin', validateSignInUser, ctrlUser.signIn)
router.post('/signout', guard, ctrlUser.signOut)

router.get('/current', guard, ctrlUser.currentUser)
router.get('/verify/:token', ctrlUser.verifyUser)
router.post('/verify', ctrlUser.repeatVerification)

router.patch('/avatars', guard, upload.single('avatar'), ctrlUser.avatars)

module.exports = router
