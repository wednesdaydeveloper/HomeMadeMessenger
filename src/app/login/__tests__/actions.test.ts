import { login, signup, signInWithGoogle } from '../actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { LoginForm } from '../models'

// モックの設定
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

describe('actions.ts', () => {
  let mockCreateClient: jest.Mock
  let mockRedirect: jest.Mock
  let mockRevalidatePath: jest.Mock

  beforeEach(() => {
    mockCreateClient = createClient as jest.Mock
    mockRedirect = redirect as jest.Mock
    mockRevalidatePath = revalidatePath as jest.Mock

    // Supabase クライアントのモック
    mockCreateClient.mockReturnValue({
      auth: {
        signInWithPassword: jest.fn(),
        signUp: jest.fn(),
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('redirects to /todolist on successful login', async () => {
      // モックの設定
      mockCreateClient().auth.signInWithPassword.mockResolvedValueOnce({ error: null })

      // テストデータ
      const formData: LoginForm = { email: 'test@example.com', password: 'password123' }

      // 関数を実行
      await login(formData)

      // 検証
      expect(mockCreateClient().auth.signInWithPassword).toHaveBeenCalledWith(formData)
      expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
      expect(mockRedirect).toHaveBeenCalledWith('/todolist')
      expect(mockRedirect).not.toHaveBeenCalledWith('/error')
    })

    it('redirects to /error on login failure', async () => {
      // モックの設定
      mockCreateClient().auth.signInWithPassword.mockResolvedValueOnce({ error: new Error('Login failed') })

      // テストデータ
      const formData: LoginForm = { email: 'test@example.com', password: 'password123' }

      // 関数を実行
      await login(formData)

      // 検証
      expect(mockCreateClient().auth.signInWithPassword).toHaveBeenCalledWith(formData)
      expect(mockRedirect).toHaveBeenCalledWith('/error')
      expect(mockRedirect).not.toHaveBeenCalledWith('/todolist')
      expect(mockRevalidatePath).not.toHaveBeenCalledWith('/', 'layout')
    })
  })

  describe('signup', () => {
    it('redirects to /login on successful signup', async () => {
      // モックの設定
      mockCreateClient().auth.signUp.mockResolvedValueOnce({ error: null })

      // テストデータ
      const formData: LoginForm = { email: 'test@example.com', password: 'password123' }

      // 関数を実行
      await signup(formData)

      // 検証
      expect(mockCreateClient().auth.signUp).toHaveBeenCalledWith(formData)
      expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
      expect(mockRedirect).toHaveBeenCalledWith('/login')
      expect(mockRedirect).not.toHaveBeenCalledWith('/error')
    })

    it('redirects to /error on signup failure', async () => {
      // モックの設定
      mockCreateClient().auth.signUp.mockResolvedValueOnce({ error: new Error('Signup failed') })

      // テストデータ
      const formData: LoginForm = { email: 'test@example.com', password: 'password123' }

      // 関数を実行
      await signup(formData)

      // 検証
      expect(mockCreateClient().auth.signUp).toHaveBeenCalledWith(formData)
      expect(mockRedirect).toHaveBeenCalledWith('/error')
      expect(mockRedirect).not.toHaveBeenCalledWith('/todolist')
      expect(mockRevalidatePath).not.toHaveBeenCalledWith('/', 'layout')
    })
  })
})

describe('signInWithGoogle', () => {
  let mockCreateClient: jest.Mock
  let mockRedirect: jest.Mock

  beforeEach(() => {
    mockCreateClient = createClient as jest.Mock
    mockRedirect = redirect as jest.Mock

    // Supabase クライアントのモック
    mockCreateClient.mockReturnValue({
      auth: {
        signInWithOAuth: jest.fn(),
      },
    })

    // 環境変数の設定
    process.env.VERCEL_URL = 'http://localhost:3210'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('redirects to the OAuth URL on successful sign-in', async () => {
    // `signInWithOAuth` のモックデータを設定
    mockCreateClient().auth.signInWithOAuth.mockResolvedValueOnce({
      data: { url: 'http://localhost:3210/auth/callback?next=/todolist' },
      error: null,
    })

    // 関数を実行
    await signInWithGoogle()

    // `signInWithOAuth` が正しい引数で呼び出されたことを確認
    expect(mockCreateClient().auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3210/auth/callback?next=/todolist',
      },
    })

    // `redirect` が正しい URL で呼び出されたことを確認
    expect(mockRedirect).toHaveBeenCalledWith('http://localhost:3210/auth/callback?next=/todolist')
  })

  it('redirects to the OAuth URL（VERCEL_URL is undefined） on successful sign-in', async () => {
    // 環境変数の設定
    delete process.env.VERCEL_URL
    // `signInWithOAuth` のモックデータを設定
    mockCreateClient().auth.signInWithOAuth.mockResolvedValueOnce({
      data: { url: 'http://localhost:3000/auth/callback?next=/todolist' },
      error: null,
    })

    // 関数を実行
    await signInWithGoogle()

    // `signInWithOAuth` が正しい引数で呼び出されたことを確認
    expect(mockCreateClient().auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback?next=/todolist',
      },
    })

    // `redirect` が正しい URL で呼び出されたことを確認
    expect(mockRedirect).toHaveBeenCalledWith('http://localhost:3000/auth/callback?next=/todolist')
  })

  it('logs an error when sign-in fails', async () => {
    // `signInWithOAuth` のモックデータを設定（エラーが発生した場合）
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    mockCreateClient().auth.signInWithOAuth.mockResolvedValueOnce({
      data: null,
      error: new Error('OAuth sign-in failed'),
    })

    // 関数を実行
    await signInWithGoogle()

    // `signInWithOAuth` が正しい引数で呼び出されたことを確認
    expect(mockCreateClient().auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3210/auth/callback?next=/todolist',
      },
    })

    // エラーがログに記録されていることを確認
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing in:', new Error('OAuth sign-in failed'))

    // `redirect` が呼び出されていないことを確認
    expect(mockRedirect).not.toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })
})