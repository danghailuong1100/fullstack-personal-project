import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onPressLike, onPressRemove, shouldShowRemove }) => {
  const [visible, setVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handlePressLike = () => {
    onPressLike(blog)
  }

  const handlePressRemove = () => {
    onPressRemove(blog)
  }

  return (
    <div style={blogStyle} className="blog">
      <p>
        <span>{blog.title}</span> <span>{blog.author}</span>
        <button className="blog_view_btn" onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </p>
      {visible && (
        <>
          <p>{blog.url}</p>
          <p>
            {blog.likes} <button onClick={handlePressLike}>like</button>
          </p>
          <p>{blog.user.name}</p>
          {shouldShowRemove && <button onClick={handlePressRemove}>remove</button>}
        </>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onPressLike: PropTypes.func.isRequired,
  onPressRemove: PropTypes.func.isRequired,
  shouldShowRemove: PropTypes.bool.isRequired
}

export default Blog
