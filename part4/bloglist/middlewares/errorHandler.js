const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    res.status(400)
    res.json({ error: err.message })
    return
  }

  if (err.name === 'CastError') {
    res.status(404)
    res.json({ error: 'Not found' })
    return
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token'
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired'
    })
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      error: 'not allowed'
    })
  }
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  next(err)
}

module.exports = errorHandler
