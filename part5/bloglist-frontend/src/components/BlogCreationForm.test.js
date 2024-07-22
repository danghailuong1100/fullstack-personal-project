import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogCreationForm from './BlogCreationForm'

let emit

beforeAll(() => {
  ({ emit } = window._virtualConsole)
})

beforeEach(() => {
  window._virtualConsole.emit = jest.fn()
})

afterAll(() => {
  window._virtualConsole.emit = emit
})

test('submit handler of blog form are given correct parameters', async () => {
  const mockedSubmitHandler = jest.fn()
  const user = userEvent.setup()

  render(<BlogCreationForm onSubmit={mockedSubmitHandler} />)

  const inputs = screen.getAllByRole('textbox')

  await user.type(inputs[0], 'Test title')
  await user.type(inputs[1], 'Test author')
  await user.type(inputs[2], 'https://example.dev')
  await user.click(screen.getByText('save'))

  expect(mockedSubmitHandler.mock.calls[0][0]).toEqual({
    title: 'Test title',
    author: 'Test author',
    url: 'https://example.dev'
  })
})

