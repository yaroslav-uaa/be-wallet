const Users = require('../repositories/users')
const HttpCode = require('../helpers/constants')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const SECRET_KEY = process.env.SECRET_KEY

const signUpUser = async (req, res, next) => {
  try {
    const user = await Users.findUserByEmail(req.body.email)

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email is already used',
      })
    }

    const { id, email, name, avatar } = await Users.createUser(req.body)

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      message: 'You registered successfully',
      user: { id, name, email, avatar },
    })
  } catch (e) {
    next(e)
  }
}
const signIn = async (req, res, next) => {
  try {
    const user = await Users.findUserByEmail(req.body.email)
    const isValidPassword = await user?.isValidPassword(req.body.password)
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Invalid login or password',
      })
    }
    const id = user.id
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
    await Users.updateTokenUser(id, token)

    const { name, email } = user
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { token, user: { name, email } },
      message: 'You have logged in',
    })
  } catch (e) {
    next(e)
  }
}

const signOut = async (req, res, next) => {
  try {
    const id = req.user.id
    await Users.updateTokenUser(id, null)
    return res.status(HttpCode.NO_CONTENT).json({})
  } catch (e) {
    next(e)
  }
}

const currentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Not authorized',
      })
    }

    const { name, email } = req.user

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      user: { name, email },
    })
  } catch (error) {
    next(error)
  }
}

const avatars = async (req, res, next) => {
  res.json({ message: 'avatar success' })
}

module.exports = {
  signUpUser,
  signIn,
  signOut,
  currentUser,
  avatars,
}
