import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogCreationForm from './components/BlogCreationForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return <div>{notification.content}</div>
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [refreshBlogKey, setRefreshBlogKey] = useState(0)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('currentUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification({ content: 'Wrong credentials', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('currentUser')
    setUser(null)
  }

  const addBlog = async ({ title, author, url }) => {
    try {
      const blog = await blogService.create({
        title,
        author,
        url
      })
      setRefreshBlogKey((prev) => prev + 1)

      setNotification({
        content: `a new blog ${blog.title} by ${blog.author} added`,
        type: 'success'
      })
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      setNotification({
        content: 'Cannot add the blog',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const updateLike = async (blog) => {
    try {
      await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1
      })
      setRefreshBlogKey((prev) => prev + 1)
    } catch (exception) {
      setNotification({
        content: 'Cannot update likes',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const removeBlog = async blog => {
    try {
      const isConfirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
      if (isConfirmed) {
        await blogService.remove(blog.id)
        setRefreshBlogKey((prev) => prev + 1)
      }
    } catch (exception) {
      setNotification({
        content: 'Cannot remove blog',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const appContent = () => {
    return (
      <>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogCreationForm onSubmit={addBlog} />
        </Togglable>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} onPressLike={updateLike} onPressRemove={removeBlog} shouldShowRemove={blog.user.username === user.username} />
        ))}
      </>
    )
  }

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs.sort((blogA, blogB) => {
        return blogB.likes - blogA.likes
      })))
    }
  }, [user, refreshBlogKey])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('currentUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      {user === null
        ? (
          loginForm()
        )
        : (
          <div>
            <p>
              {user.name} logged in <button onClick={handleLogout}>Logout</button>
            </p>
            {appContent()}
          </div>
        )}
    </div>
  )
}

export default App
