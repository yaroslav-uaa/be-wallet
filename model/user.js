const { Schema, model } = require('mongoose')
const { v4: uuid } = require('uuid')

const bcrypt = require('bcryptjs')
require('dotenv').config()

const SALT_WORK_FACTOR = 8

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set your name pls'],
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    token: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
    },
    idCloudAvatar: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      required: true,
      default: uuid(),
    },
    // verified: Date,
    resetToken: {
      token: String,
      expires: Date,
    },
    passwordReset: Date,
    created: { type: Date, default: Date.now },
    updated: Date,
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id
        delete ret.password
      },
    },
  }
)
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

// userSchema.virtual('isVerified').get(function () {
//   return !!(this.verified || this.passwordReset)
// })

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = model('user', userSchema)

module.exports = User
