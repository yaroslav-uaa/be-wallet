const User = require('../model/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const EmailService = require('../services/mail-generator')
const CreateSenderNodemailer = require('../services/email-sender')

const findUserById = async (id) => {
  return await User.findById(id)
}

const findUserByEmail = async (email) => {
  return await User.findOne({ email })
}
const findByVerifyToken = async (verifyToken) => {
  return await User.findOne({ verifyToken })
}

const createUser = async (body) => {
  const user = new User(body)
  return await user.save()
}

const updateTokenUser = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
}
const updateVerifyToken = async (id, verified, verifyToken) => {
  return await User.updateOne({ _id: id }, { verified, verifyToken })
}

const updateAvatar = async (id, avatar, idCloudAvatar = null) => {
  return await User.updateOne({ _id: id }, { avatar, idCloudAvatar })
}
const updateUser = async (id, body) => {
  const result = await User.findOneAndUpdate(
    { _id: id },
    { ...body },
    { new: true }
  )
  return result
}

// helper functions
const randomTokenString = () => {
  return crypto.randomBytes(40).toString('hex')
}

const hash = (password) => {
  return bcrypt.hashSync(password, 10)
}

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email })

  // always return ok response to prevent email enumeration
  if (!user) return

  // create reset token that expires after 24 hours
  user.resetToken = {
    token: randomTokenString(),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }
  await user.save()
  // send email
  try {
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderNodemailer()
    )
    await emailService.sendResetPasswordEmail(user, email)
  } catch (error) {
    console.log(error)
  }
}

const verifyResetToken = async ({ token }) => {
  const result = await User.findOne({
    'resetToken.token': token,
    'resetToken.expires': { $gt: Date.now() },
  })
  return result
}

const resetPassword = async ({ token, password }) => {
  const user = await User.findOne({
    'resetToken.token': token,
    'resetToken.expires': { $gt: Date.now() },
  })
  // update password and remove reset token
  user.password = hash(password)
  user.passwordReset = Date.now()
  user.resetToken = undefined
  await user.save()
}

module.exports = {
  findUserById,
  findUserByEmail,
  findByVerifyToken,
  createUser,
  updateTokenUser,
  updateVerifyToken,
  updateAvatar,
  updateUser,
  verifyResetToken,
  forgotPassword,
  resetPassword,
}
