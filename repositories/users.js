const User = require('../model/user')
const bcrypt = require('bcryptjs')

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

const hash = (password) => {
  return bcrypt.hashSync(password, 10)
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
  user.resetToken = null
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
  resetPassword,
}
