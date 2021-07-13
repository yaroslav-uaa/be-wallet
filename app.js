const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { limiterAPI } = require('./helpers/constants')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const transactionsRouter = require('./routes/api/transactions/index')
const categoriesRouter = require('./routes/api/transactions/categories')
const usersRouter = require('./routes/api/users/index')
const capitalRouter = require('./routes/api/transactions/capital')

require('dotenv').config()
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wallet API',
      version: '1.0.0',
      description: 'A simple Express Wallet API build with MongoDB',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./routes/api/users/index.js', './routes/api/transactions/index.js'],
}

const specs = swaggerJsDoc(options)
const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
// Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet())
app.use(logger(formatsLogger))
app.use(express.static(path.join(__dirname, AVATAR_OF_USERS)))
app.use(cors())
app.use(express.json({ limit: 10000 }))
app.use('/api/', rateLimit(limiterAPI))

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.use('/api/transactions', transactionsRouter)
app.use('/api/users', usersRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/capital', capitalRouter)

//! control error
app.use((req, res) => {
  res.status(404).json({ status: 'error', code: 404, message: 'Not found' })
})
//! uncontrol error
app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({
    status: status === 500 ? 'fail' : 'error',
    code: status,
    message: err.message,
  })
})

module.exports = app
