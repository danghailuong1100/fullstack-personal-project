const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helpers')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('should warn correct error message for invalid users', async () => {
    const shortUsername = {
      username: 'he',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    let response = await api
      .post('/api/users')
      .send(shortUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('username must be at least 3 character')

    const shortPassword = {
      username: 'he1',
      name: 'Matti Luukkainen',
      password: 'sa'
    }

    response = await api
      .post('/api/users')
      .send(shortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('password must be at least 3 character')

    const sameUsername = {
      username: 'root',
      name: 'Matti Luukkainen',
      password: 'sa1'
    }

    response = await api
      .post('/api/users')
      .send(sameUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe('username must be unique')
  })
})
