const Joi = require('joi')

const schemaSignUpUser = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(8).max(15).required(),
  name: Joi.string().required(),
})

const schemaSignInUser = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
})

const schemaForgotPassword = Joi.object({
  email: Joi.string().email().required(),
})

const schemaResetPassword = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
})

const schemaResetToken = Joi.object({
  token: Joi.string().required(),
})

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj)
    next()
  } catch (err) {
    next({
      status: 400,
      message: err.message.replace(/"/g, ''),
    })
  }
}

module.exports = {
  validationSignUpUser: (req, res, next) => {
    return validate(schemaSignUpUser, req.body, next)
  },

  validateSignInUser: (req, res, next) => {
    return validate(schemaSignInUser, req.body, next)
  },
  validateForgotPassword: (req, res, next) => {
    return validate(schemaForgotPassword, req.body, next)
  },

  validateResetPassword: (req, res, next) => {
    return validate(schemaResetPassword, req.body, next)
  },
  validateResetToken: (req, res, next) => {
    return validate(schemaResetToken, req.body, next)
  },
}
