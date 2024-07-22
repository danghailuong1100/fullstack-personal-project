require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const PhoneBookEntry = require('./models')

app.use(express.json())
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      req.method === 'POST' ? JSON.stringify(req.body) : ''
    ].join(' ')
  })
)
app.use(express.static('build'))
app.use(cors())

app.get('/api/persons', (request, response, next) => {
  PhoneBookEntry.find({})
    .then((result) => {
      response.json(result)
    })
    .catch((error) => {
      next(error)
    })
})

app.post('/api/persons', ({ body }, res, next) => {
  PhoneBookEntry.find({ name: body.name }).then(
    (result) => {
      if (result.length > 0) {
        res.status(400).json({
          error: `${body.name} already exists`
        })
      } else {
        const newEntry = new PhoneBookEntry(body)
        newEntry
          .save()
          .then((result) => {
            res.status(201).json(result)
          })
          .catch((error) => {
            next(error)
          })
      }
    },
    (error) => {
      next(error)
    }
  )
})

app.put('/api/persons/:id', ({ body, params }, res, next) => {
  const entry = {
    name: body.name,
    number: body.number
  }

  PhoneBookEntry.findByIdAndUpdate(params.id, entry, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then((updatedEntry) => {
      res.json(updatedEntry)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  PhoneBookEntry.findById(req.params.id).then(
    (result) => {
      if (result) {
        res.json(result)
      } else {
        res.status(404).end()
      }
    },
    (error) => {
      next(error)
    }
  )
})

app.delete('/api/persons/:id', (req, res, next) => {
  PhoneBookEntry.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

app.get('/info', (request, response) => {
  PhoneBookEntry.count({}).then((result) => {
    response.send(`
        <p>Phone book has info for ${result} people</p>
        <p>${new Date().toString()}</p>
    `)
  })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
