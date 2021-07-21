const Users = require('../repositories/users')
const { HttpCode } = require('../helpers/constants')
const jwt = require('jsonwebtoken')
const fs = require('fs/promises')
const EmailService = require('../services/mail-generator')
const CreateSenderNodemailer = require('../services/email-sender')

require('dotenv').config()

const UploadAvatarService = require('../services/cloud-upload')
const SECRET_KEY = process.env.SECRET_KEY

// Users CONTROLLERS

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

    const { id, email, name, verifyToken, avatar } = await Users.createUser(
      req.body
    )
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
    if (!user || !user.verified || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is incorrect',
      })
    }
    const id = user.id
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
    await Users.updateTokenUser(id, token)

    const { name, email, avatar } = user
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      token,
      user: { name, email, avatar },
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
    if (!req.user.token) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Token Not valid',
      })
    }
    const { name, email, avatar } = req.user

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      user: { name, email, avatar },
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
      fs.readFile('../verifyPage/index.html', null, function (error, data) {
        if (error) {
          res.writeHead(404)
          res.write('File not found!')
        } else {
          res.write(data)
        }
        res.end()
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
    const user = await Users.findUserByEmail(req.body.email)
    if (user) {
      const { email, verified, verifyToken } = user
      if (!verified) {
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
        message: 'Email has been already verified',
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

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id
    const uploads = new UploadAvatarService()
    const { idCloudAvatar, avatarURL } = await uploads.saveAvatar(
      req.file.path,
      req.user.idCloudAvatar
    )

    await fs.unlink(req.file.path)

    await Users.updateAvatar(id, avatarURL, idCloudAvatar)
    res.json({ status: 'success', code: HttpCode.OK, data: { avatarURL } })
  } catch (error) {
    next(error)
  }
}

const updateUserInfo = async (req, res, next) => {
  try {
    const userId = req.user.id
    const result = await Users.updateUser(userId, req.body)
    console.log(result)
    if (result) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: { result },
      })
    }
    return res.json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    })
  } catch (e) {
    next(e)
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const user = await Users.findUserByEmail(req.body.email)
    if (user) {
      const { email, resetToken } = user
      if (!verified) {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderNodemailer()
        )
        await emailService.sendResetPasswordEmail(resetToken, email)
        return res.status(HttpCode.OK).json({
          status: 'success',
          code: HttpCode.OK,
          message: 'Resubmitted verification',
        })
      }
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email has been already verified',
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

// const forgotPassword = async (req, res, next) => {
//   try {
//     const result = Users.forgotPassword(req.body)
//     if (!result) {
//       return res.json({
//         status: 'error',
//         code: HttpCode.CONFLICT,
//         message: 'Something wrong',
//       })
//     }
//     return res.json({
//       status: 'success',
//       code: HttpCode.OK,
//       message: 'Please check your email for password reset instructions',
//     })
//   } catch (error) {
//     next(error)
//   }
// }

const verifyResetToken = async (req, res, next) => {
  try {
    const result = Users.validateResetToken(req.body)
    if (!result) {
      return res.json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Token is  not valid',
      })
    }
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Token is valid',
    })
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const result = Users.resetPassword(req.body)
    if (!result) {
      return res.json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Token is  not valid',
      })
    }
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Password reset successful, you can now login',
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
  avatars,
  updateUserInfo,
  verifyResetToken,
  forgotPassword,
  resetPassword,
}
