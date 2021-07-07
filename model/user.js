const { Schema, model } = require('mongoose')

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
    token: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = model('user', userSchema)

module.exports = User
