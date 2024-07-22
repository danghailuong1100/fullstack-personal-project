class ForbiddenError extends Error {
  constructor () {
    super()
    this.name = 'ForbiddenError'
  }
}

class UnauthorizedError extends Error {
  constructor () {
    super()
    this.name = 'UnauthorizedError'
  }
}

module.exports = { ForbiddenError, UnauthorizedError }
