import { render, screen } from '@testing-library/react'
import PrivatePage from '../page'
import '@testing-library/jest-dom'
import { createClient } from '@/utils/supabase/server'

// `createClient` をモック化
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}))

describe('PrivatePage Component', () => {
  let mockCreateClient: jest.Mock

  beforeEach(() => {
    mockCreateClient = createClient as jest.Mock

    // モックの初期化
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn(),
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the user email when user is authenticated', async () => {
    // `getUser` のモックデータを設定
    mockCreateClient().auth.getUser.mockResolvedValueOnce({
      data: { user: { email: 'test@example.com' } }
    })

    // コンポーネントをレンダリング
    render(await PrivatePage())

    // ユーザーのメールアドレスが表示されていることを確認
    expect(screen.getByText('Hello test@example.com')).toBeInTheDocument()
  })

  it('handles unauthenticated user by not rendering email', async () => {
    // `getUser` のモックデータを設定（ユーザーが存在しない場合）
    mockCreateClient().auth.getUser.mockResolvedValueOnce({
      data: { user: null }
    })

    // コンポーネントをレンダリング
    render(await PrivatePage())

    // メールアドレスが表示されていないことを確認
    expect(screen.queryByText('Hello ')).not.toBeInTheDocument()
  })

  it('handles errors from getUser', async () => {
    // `getUser` のモックデータを設定（エラーが発生した場合）
    mockCreateClient().auth.getUser.mockResolvedValueOnce({
      data: null
    })

    // コンポーネントをレンダリング
    render(await PrivatePage())

    // メールアドレスが表示されていないことを確認
    expect(screen.queryByText('Hello ')).not.toBeInTheDocument()
  })
})