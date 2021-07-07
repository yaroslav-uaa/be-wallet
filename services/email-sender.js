const nodemailer = require('nodemailer')
require('dotenv').config()

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_NODEMAILER,
        pass: process.env.PASSWORD_NODEMAILER,
      },
    }
    const transporter = nodemailer.createTransport(config)
    return await transporter.sendMail({
      ...msg,
      from: process.env.EMAIL_NODEMAILER,
    })
  }
}

module.exports = CreateSenderNodemailer
