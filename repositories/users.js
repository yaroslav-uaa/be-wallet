const User = require('../model/user')

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
const updateVerifyToken = async (id, isVerified, verifyToken) => {
  return await User.updateOne({ _id: id }, { isVerified, verifyToken })
}

module.exports = {
  findUserById,
  findUserByEmail,
  findByVerifyToken,
  createUser,
  updateTokenUser,
  updateVerifyToken,
}
