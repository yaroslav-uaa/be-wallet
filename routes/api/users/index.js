const express = require('express')
const router = express.Router()
const ctrlUser = require('../../../controllers/users')
const guard = require('../../../helpers/guard')
const upload = require('../../../helpers/upload')
const {
  validateSignInUser,
  validationSignUpUser,
  validateResetPassword,
  validateForgotPassword,
  validateResetToken,
} = require('./validation')

router.post('/signup', validationSignUpUser, ctrlUser.signUpUser)
router.post('/signin', validateSignInUser, ctrlUser.signIn)
router.post('/signout', guard, ctrlUser.signOut)
router.get('/current', guard, ctrlUser.currentUser)

router.get('/verify/:token', ctrlUser.verifyUser)
router.post('/verify', ctrlUser.repeatVerification)
router.patch('/avatars', guard, upload.single('avatar'), ctrlUser.avatars)
router.put('/update', guard, ctrlUser.updateUserInfo)

// forgot&reset password
router.post(
  '/forgot-password',
  guard,
  validateForgotPassword,
  ctrlUser.forgotPassword
)
router.post(
  '/verified-reset-token',
  guard,
  validateResetToken,
  ctrlUser.verifyResetToken
)
router.post(
  '/reset-password',
  guard,
  validateResetPassword,
  ctrlUser.resetPassword
)

module.exports = router
