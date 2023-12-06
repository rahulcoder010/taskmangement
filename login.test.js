import { render, fireEvent } from '@testing-library/react'
import Login from './Login'

test('renders login component', () => {
  render(<Login />)
})

test('allows user to login with valid credentials', () => {
  const { getByLabelText, getByText } = render(<Login />)

  const usernameInput = getByLabelText('Username')
  const passwordInput = getByLabelText('Password')
  const loginButton = getByText('Login')

  fireEvent.change(usernameInput, { target: { value: 'testuser' } })
  fireEvent.change(passwordInput, { target: { value: 'password123' } })

  fireEvent.click(loginButton)

  // Assert the desired behavior here
})

test('displays error message with invalid credentials', () => {
  const { getByLabelText, getByText } = render(<Login />)

  const usernameInput = getByLabelText('Username')
  const passwordInput = getByLabelText('Password')
  const loginButton = getByText('Login')

  fireEvent.change(usernameInput, { target: { value: 'invaliduser' } })
  fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })

  fireEvent.click(loginButton)

  // Assert the desired behavior here
})