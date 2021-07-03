const express = require('express')
const router = express.Router()

router.get('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.get('/:transactionId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.delete('/:transactionId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.patch('/:transactionId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
