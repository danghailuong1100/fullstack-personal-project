const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { UnauthorizedError } = require('../utils/errors')

const userExtractor = async (req, res, next) => {
  // code that extracts the token
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    throw new UnauthorizedError()
  }
  req.user = await User.findById(decodedToken.id)
  next()
}

module.exports = userExtractor
