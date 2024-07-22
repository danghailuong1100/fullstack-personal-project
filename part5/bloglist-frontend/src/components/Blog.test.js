import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('blog only shows author and title by default', () => {
  const blog = {
    author: 'Jarvis Luong',
    url: 'https://example.com/test-blog',
    title: 'Test blog',
    likes: 2
  }

  const emptyFn = () => {}

  render(<Blog blog={blog} onPressLike={emptyFn} onPressRemove={emptyFn} shouldShowRemove={false} />)

  // Visible
  expect(screen.getByText(blog.title)).toBeDefined()
  expect(screen.getByText(blog.author)).toBeDefined()

  // Not visible
  expect(() => screen.getByText(blog.url)).toThrow()
  expect(() => screen.getByText(blog.likes.toString())).toThrow()
})

test('blog shows likes and url when clicked view', async () => {
  const blog = {
    author: 'Jarvis Luong',
    url: 'https://example.com/test-blog',
    title: 'Test blog',
    likes: 2,
    user: {
      name: 'Jarvis Luong'
    }
  }

  const emptyFn = jest.fn()

  const user = userEvent.setup()

  render(<Blog blog={blog} onPressLike={emptyFn} onPressRemove={emptyFn} shouldShowRemove={false} />)

  await user.click(screen.getByText('view'))

  // Not visible
  expect(screen.getByText(blog.url)).toBeDefined()
  expect(screen.getByText(blog.likes.toString())).toBeDefined()
})

test('likes event handler should be called twice when clicked twice', async () => {
  const blog = {
    author: 'Jarvis Luong',
    url: 'https://example.com/test-blog',
    title: 'Test blog',
    likes: 2,
    user: {
      name: 'Jarvis Luong'
    }
  }

  const likeHandler = jest.fn()
  const emptyFn = jest.fn()

  const user = userEvent.setup()

  render(<Blog blog={blog} onPressLike={likeHandler} onPressRemove={emptyFn} shouldShowRemove={false} />)

  await user.click(screen.getByText('view'))
  await user.click(screen.getByText('like'))
  await user.click(screen.getByText('like'))

  // Not visible
  expect(likeHandler.mock.calls).toHaveLength(2)
})