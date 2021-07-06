const passport = require('passport')
require('../config/passport')
const HttpCode = require('./constants')

// function high order
const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const headerAuth = req.get('Authorization')
    let token = null
    if (headerAuth) {
      token = headerAuth.split(' ')[1]
    }
    if (err || !user || token !== user?.token) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Invalid credentials',
      })
    }

    req.user = user
    return next()
  })(req, res, next)
  console.log(req)
}
module.exports = guard
