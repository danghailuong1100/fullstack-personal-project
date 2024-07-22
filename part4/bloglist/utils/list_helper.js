const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => {
    return acc + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((acc, blog) => {
    if (!acc) {
      return blog
    }
    if (acc.likes < blog.likes) {
      return blog
    }
    return acc
  }, null)
}

const mostBlog = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, (blog) => {
    return blog.author
  })

  const authorWithMostBlog = _.maxBy(Object.keys(blogsByAuthor), (author) => {
    return blogsByAuthor[author].length
  })

  return {
    author: authorWithMostBlog,
    blogs: blogsByAuthor[authorWithMostBlog].length
  }
}

const mostLikes = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, (blog) => {
    return blog.author
  })

  const authorWithMostLikes = _.maxBy(Object.keys(blogsByAuthor), (author) => {
    return _.sumBy(blogsByAuthor[author], (blog) => blog.likes)
  })

  return {
    author: authorWithMostLikes,
    likes: _.sumBy(blogsByAuthor[authorWithMostLikes], (blog) => blog.likes)
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlog,
  mostLikes
}
