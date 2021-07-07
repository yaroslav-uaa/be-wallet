const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const transactionsRouter = require('./routes/api/transactions/index')
const categoriesRouter = require('./routes/api/transactions/categories')
const usersRouter = require('./routes/api/users/index')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/transactions', transactionsRouter)
app.use('/api/users', usersRouter)
app.use('/api/categories', categoriesRouter)

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
