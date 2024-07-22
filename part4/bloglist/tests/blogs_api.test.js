const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'jarvis luong',
    url: 'https://example.com/html-is-easy',
    likes: 6
  },
  {
    title: 'Browser can execute only Javascript',
    author: 'hai',
    url: 'https://example.com/browsers-can-execute-only-javascript',
    likes: 9
  }
]

async function getAccessToken () {
  const loginResponse = await api.post('/api/login').send({ username: 'root', password: 'secret' }).expect(200)
  return loginResponse.body.token
}

describe('blog apis with initial blogs', () => {
  test('blogs are returned as json', async () => {
    const token = await getAccessToken()

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body).toHaveLength(2)
  })

  test('blogs returned has id', async () => {
    const token = await getAccessToken()
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body[0].id).toBeDefined()
  })

  test('calls to create a new blog should successfully creates one', async () => {
    const token = await getAccessToken()
    const newBlog = {
      title: 'a new blog test',
      author: 'luong',
      url: 'https://exampleblogs.com/a-new-blog-test',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`).send()

    expect(response.body).toHaveLength(initialBlogs.length + 1)

    const titles = response.body.map(r => r.title)

    expect(titles).toContain('a new blog test')
  })

  test('calls to create a new blog should default likes to 0 if not present', async () => {
    const token = await getAccessToken()
    const newBlog = {
      title: 'a new blog test',
      author: 'luong',
      url: 'https://exampleblogs.com/a-new-blog-test'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toEqual(0)
  })

  test('calls to create a new blog without title or author will fail', async () => {
    const token = await getAccessToken()
    const newBlog = {
      url: 'https://exampleblogs.com/a-new-blog-test',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('should return not found if delete wrong id', async () => {
    const token = await getAccessToken()
    await api
      .delete('/api/blogs/somewrongid')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  test('should correctly delete blog if passing correct id', async () => {
    const token = await getAccessToken()
    let response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send()

    const blogs = response.body

    const firstBlogId = blogs[0].id

    await api
      .delete(`/api/blogs/${firstBlogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`).send()

    expect(response.body).toHaveLength(1)

    expect(response.body.map(r => r.id)).not.toContain(firstBlogId)
  })

  test('should correctly update blogs like', async () => {
    const token = await getAccessToken()
    let response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send()

    const blogs = response.body

    const firstBlogId = blogs[0].id

    response = await api
      .put(`/api/blogs/${firstBlogId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ likes: 100 })
      .expect(200)

    expect(response.body.likes).toBe(100)
  })

  test('should return unauthorized error if token is not provided', async () => {
    const newBlog = {
      title: 'a new blog test',
      author: 'luong',
      url: 'https://exampleblogs.com/a-new-blog-test',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()

  await Blog.deleteMany({})
  const blog1 = new Blog({ ...initialBlogs[0], user: user._id })
  await blog1.save()
  const blog2 = new Blog({ ...initialBlogs[1], user: user._id })
  await blog2.save()
})

afterAll(() => {
  mongoose.connection.close()
})
