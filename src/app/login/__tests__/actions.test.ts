import { login, signup } from '../actions'
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