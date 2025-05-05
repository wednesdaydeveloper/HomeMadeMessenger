// モックの設定
jest.mock('@/app/login/actions', () => ({
  login: jest.fn(),
  signup: jest.fn(),
}))

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from '../page'
import { login, signup } from '@/app/login/actions'
import '@testing-library/jest-dom'

describe('Login Component', () => {
  let mockLogin: jest.Mock
  let mockSignup: jest.Mock

  beforeEach(() => {
    mockLogin = login as jest.Mock
    mockSignup = signup as jest.Mock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })


  const setUp = () => {
    render(<Login />);
    const emailInput = screen.getByTestId('email')
    const passwordInput = screen.getByTestId('password')
    const emailError = screen.getByTestId('email-error')
    const passwordError = screen.getByTestId('password-error')
    const loginButton = screen.getByRole('button',{name:'ログイン'})
    const signupButton = screen.getByRole('button',{name:'登録'})
    return { emailInput, passwordInput, emailError, passwordError, loginButton, signupButton }
  };

  it('renders the login form correctly', () => {

    const { emailInput, passwordInput, emailError, passwordError, loginButton, signupButton } = setUp()

    // フォームの要素が正しく表示されていることを確認
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(loginButton).toBeInTheDocument()
    expect(signupButton).toBeInTheDocument()
    expect(emailError.textContent).toBe('')
    expect(passwordError.textContent).toBe('')
  })

  it('calls the login function when the login button is clicked', async () => {
    const { emailInput, passwordInput, loginButton } = setUp()

    // 入力フィールドに値を入力
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // ログインボタンをクリック
    fireEvent.click(loginButton)
    screen.debug()
    // login 関数が正しい引数で呼び出されたことを確認
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(mockSignup).toHaveBeenCalledTimes(0)

      expect(screen.getByTestId('email-error').textContent).toBe('')
      expect(screen.getByTestId('password-error').textContent).toBe('')
    })
  })

  it('calls the signup function when the signup button is clicked', async () => {
    const { emailInput, passwordInput, signupButton } = setUp()

    // 入力フィールドに値を入力
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // 登録ボタンをクリック
    fireEvent.click(signupButton)

    // signup 関数が正しい引数で呼び出されたことを確認
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(mockLogin).toHaveBeenCalledTimes(0)

      expect(screen.getByTestId('email-error').textContent).toBe('')
      expect(screen.getByTestId('password-error').textContent).toBe('')
    })
  })

  it('shows validation errors when fields are empty', async () => {
    const { emailInput, passwordInput, loginButton } = setUp()

    // 入力フィールドに値を入力
    fireEvent.change(emailInput, { target: { value: '' } })
    fireEvent.change(passwordInput, { target: { value: '' } })

    // ログインボタンをクリック
    fireEvent.click(loginButton)

    // バリデーションエラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByTestId('email-error').textContent).toBe('メールアドレスは必須です。')
      expect(screen.getByTestId('password-error').textContent).toBe('パスワードは必須です。')
    })
  })

  it('shows an error message when email is empty', async () => {
    const { emailInput, passwordInput, loginButton } = setUp()

    // 入力フィールドに値を入力
    fireEvent.change(emailInput, { target: { value: '' } })
    fireEvent.change(passwordInput, { target: { value: 'password1234' } })


    // ログインボタンをクリック
    fireEvent.click(loginButton)

    // メールアドレスのエラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByTestId('email-error').textContent).toBe('メールアドレスは必須です。')
      expect(screen.getByTestId('password-error').textContent).toBe('')
    })
  })

  it('shows an error message when email format is invalid', async () => {
    const { emailInput, loginButton } = setUp()

    // 無効なメールアドレスを入力
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

    // ログインボタンをクリック
    fireEvent.click(loginButton)

    // メールアドレスのエラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByTestId('email-error').textContent).toBe('メールアドレスの形式が不正です。')
      expect(screen.getByTestId('password-error').textContent).toBe('')
    })
  })

  it('shows an error message when password is empty', async () => {
    const { emailInput, passwordInput, loginButton } = setUp()

    // 入力フィールドに値を入力
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '' } })

    // ログインボタンをクリック
    fireEvent.click(loginButton)

    // メールアドレスのエラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByTestId('email-error').textContent).toBe('')
      expect(screen.getByTestId('password-error').textContent).toBe('パスワードは必須です。')
    })
  })
})