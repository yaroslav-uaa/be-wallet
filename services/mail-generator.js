const Mailgen = require('mailgen')
require('dotenv').config()

class EmailService {
  constructor(env, sender) {
    this.sender = sender
    switch (env) {
      case 'development':
        this.link = 'http://cbf4fa2344e0.ngrok.io'
        break
      case 'production':
        this.link = 'link for production'
        break

      default:
        this.link = 'http://cbf4fa2344e0.ngrok.io'

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
}

module.exports = EmailService
