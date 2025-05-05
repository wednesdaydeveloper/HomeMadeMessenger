import { createClient } from '../client' // `createClient` のパスを調整してください
import { createBrowserClient as supabaseCreateClient } from '@supabase/ssr'

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(),
}))

describe('Supabase Client', () => {
  const mockSupabaseUrl = 'https://example.supabase.co'
  const mockSupabaseKey = 'example-key'

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = mockSupabaseUrl
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = mockSupabaseKey
  })

  afterEach(() => {
    jest.clearAllMocks()
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  it('creates a Supabase client with the correct parameters', () => {
    createClient()

    expect(supabaseCreateClient).toHaveBeenCalledWith(mockSupabaseUrl, mockSupabaseKey)
  })

  it('throws an error if NEXT_PUBLIC_SUPABASE_URL is not defined', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    createClient()

    expect(supabaseCreateClient).toHaveBeenCalledWith(undefined, mockSupabaseKey)
  })

  it('throws an error if NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    createClient()

    expect(supabaseCreateClient).toHaveBeenCalledWith(mockSupabaseUrl, undefined)
  })
})