import React, { useState } from 'react'

const BlogCreationForm = (props) => {
  const { onSubmit } = props
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const handleSubmit = async () => {
    await onSubmit({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <form onSubmit={handleSubmit}>
      <p>
        title:{' '}
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </p>
      <p>
        author:{' '}
        <input value={author} onChange={(e) => setAuthor(e.target.value)} />
      </p>
      <p>
        url: <input value={url} onChange={(e) => setUrl(e.target.value)} />
      </p>
      <p>
        <button type="submit">save</button>
      </p>
    </form>
  )
}

export default BlogCreationForm
