const User = require('../model/user')

const findUserById = async (id) => {
  return await User.findById(id)
}

const findUserByEmail = async (email) => {
  return await User.findOne({ email })
}

const createUser = async (body) => {
  const user = new User(body)
  return await user.save()
}

const updateTokenUser = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
}

const updateAvatar = async (id, avatar, idCloudAvatar = null) => {
  return await User.updateOne({ _id: id }, { avatar, idCloudAvatar })
}

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  updateTokenUser,
  updateAvatar,
}
