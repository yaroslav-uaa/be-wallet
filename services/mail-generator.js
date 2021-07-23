const Mailgen = require('mailgen')
require('dotenv').config()

class EmailService {
  constructor(env, sender) {
    this.sender = sender
    switch (env) {
      case 'development':
        this.link = 'https://be-wallet.herokuapp.com'
        break
      case 'production':
        this.link = 'https://be-wallet.herokuapp.com'
        break

      default:
        this.link = 'https://be-wallet.herokuapp.com'

        break
    }
  }
  #createTemplateVerificationEmail(verifyToken) {
    // Configure mailgen
    const mailGenerator = new Mailgen({
      theme: 'salted',
      textDirection: 'rtl',
      product: {
        name: 'CatsRevenants System',
        link: this.link,
        copyright: 'Copyright © 2021 CatsRevenants. All rights reserved.',
      },
    })
    const email = {
      body: {
        intro:
          "Welcome to CatsRevenants System! We're very excited to have you on board.",
        action: {
          instructions:
            'To get started with CatsRevenants System, please click here:',
          button: {
            color: '#7427F3', // Optional action button color
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
    }
    return mailGenerator.generate(email)
  }

  async sendVerifyEmail(verifyToken, email) {
    const emailHtml = this.#createTemplateVerificationEmail(verifyToken)
    const msg = {
      to: email,
      subject: 'Verify your account',
      html: emailHtml,
    }
    const result = await this.sender.send(msg)
    console.log(result)
  }

  #createTemplateResetPasswordEmail(resetToken) {
    // Configure mailgen
    const mailGenerator = new Mailgen({
      theme: 'salted',
      textDirection: 'rtl',
      product: {
        name: 'CatsRevenants System',
        link: this.link,
        copyright: 'Copyright © 2021 CatsRevenants. All rights reserved.',
      },
    })
    const passwordResetEmail = {
      body: {
        intro:
          "Welcome to CatsRevenants System! We're very excited to have you on board.",
        action: {
          instructions: 'To get reset your password, please click here:',
          button: {
            color: '#7427F3', // Optional action button color
            text: 'reset your Password',
            link: `${this.link}/api/users/reset-password?resettoken=${resetToken}`,
          },
        },
      },
    }
    return mailGenerator.generate(passwordResetEmail)
  }
  async sendResetPasswordEmail(resetToken, passwordResetEmail) {
    const emailHtml = this.#createTemplateResetPasswordEmail(resetToken)
    const msg = {
      to: passwordResetEmail,
      subject: 'Reset password for your account',
      html: emailHtml,
    }
    const result = await this.sender.send(msg)
    console.log(result)
  }
}

module.exports = EmailService
