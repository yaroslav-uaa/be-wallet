const Users = require('../repositories/users')
const HttpCode = require('../helpers/constants')
const jwt = require('jsonwebtoken')
const EmailService = require('../services/mail-generator')
const CreateSenderNodemailer = require('../services/email-sender')

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

    const { id, email, name, verifyToken } = await Users.createUser(req.body)
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderNodemailer()
      )
      await emailService.sendVerifyEmail(verifyToken, email)
    } catch (error) {
      console.log(error)
    }
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      message: 'You registered successfully',
      user: { id, name, email },
    })
  } catch (e) {
    next(e)
  }
}
const signIn = async (req, res, next) => {
  try {
    const user = await Users.findUserByEmail(req.body.email)
    const isValidPassword = await user?.isValidPassword(req.body.password)
    if (!user || !isValidPassword || !user.isVerified) {
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
const verifyUser = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.token)
    if (user) {
      await Users.updateVerifyToken(user.id, true, null)
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { message: 'Success!' },
      })
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'Verification token isn`t valid',
    })
  } catch (error) {
    next(error)
  }
}

const repeatVerification = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email)
    if (user) {
      const { email, isVerified, verifyToken } = user
      if (!isVerified) {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderNodemailer()
        )
        await emailService.sendVerifyEmail(verifyToken, email)
        return res.status(HttpCode.OK).json({
          status: 'success',
          code: HttpCode.OK,
          message: 'Resubmitted verification',
        })
      }
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email has been verified',
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'User not found',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  signUpUser,
  signIn,
  signOut,
  currentUser,
  verifyUser,
  repeatVerification,
}
