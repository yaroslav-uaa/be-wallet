const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { limiterAPI } = require('./helpers/constants')
const errorHandler = require('./middleware/error-handler')

require('dotenv').config()

const transactionsRouter = require('./routes/api/transactions/index')
const usersRouter = require('./routes/api/users/index')
const categoriesRouter = require('./routes/api/transactions/categories')
const capitalRouter = require('./routes/api/transactions/capital')

require('dotenv').config()
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
// Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet())
app.use(logger(formatsLogger))
app.use(express.static(path.join(__dirname, AVATAR_OF_USERS)))
app.use(express.static(path.join(__dirname, './verifyPage/index.html')))
app.use(cors())
app.use(express.json({ limit: 10000 }))
app.use('/api/', rateLimit(limiterAPI))

// swagger docs route
app.use('/api-docs', require('./helpers/swagger'))

// api routes
app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/capital', capitalRouter)
// global error handler
app.use(errorHandler)

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason)
  // Application specific logging, throwing an error, or other logic here
})

module.exports = app
