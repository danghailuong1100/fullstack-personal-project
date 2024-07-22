const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const tokenExtractor = (req, res, next) => {
  // code that extracts the token
  req.token = getTokenFrom(req)
  next()
}

module.exports = tokenExtractor
