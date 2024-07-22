// eslint-disable-next-line new-cap
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { ForbiddenError } = require('../utils/errors')

blogRouter.get('/', async (request, response) => {
  const notes = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
    user: request.user._id
  })

  const saveBlog = await blog.save()

  request.user.blogs = request.user.blogs.concat(saveBlog._id)
  await request.user.save()

  response.status(201).json(saveBlog)
})

blogRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  const blog = await Blog.findById(id)

  if (blog.user.toString() === request.user._id.toString()) {
    await Blog.remove({ _id: id })
    response.status(204).end()
  } else {
    throw new ForbiddenError()
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  const { user, ...updatedBlogContent } = request.body
  const { id } = request.params

  const updatedBlog = await Blog.findByIdAndUpdate({ _id: id }, updatedBlogContent, { new: true })
  if (!updatedBlog) {
    response.status(404).end()
  } else {
    response.json(updatedBlog)
  }
})

module.exports = blogRouter
