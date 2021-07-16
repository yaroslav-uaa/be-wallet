module.exports = errorHandler

function errorHandler(err, req, res, next) {
  switch (true) {
    case typeof err === 'string':
      // custom application error
      const isNot_Found = err.toLowerCase().endsWith('not found')
      const statusCode = isNot_Found ? 404 : 400
      return res.status(statusCode).json({ message: err })
    case err.name === 'ValidationError':
      // mongoose validation error
      return res.status(400).json({ message: err.message })
    case err.name === 'UnauthorizedError':
      // jwt authentication error
      return res.status(401).json({ message: 'Unauthorized' })
    default:
      return res.status(500).json({ message: err.message })
  }
}
