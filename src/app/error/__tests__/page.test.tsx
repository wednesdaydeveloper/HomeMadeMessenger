import React from 'react'
import { render, screen } from '@testing-library/react'
import ErrorPage from '../page'
import '@testing-library/jest-dom'

describe('ErrorPage Component', () => {
  it('renders the error message', () => {
    // コンポーネントをレンダリング
    render(<ErrorPage />)

    // エラーメッセージが正しく表示されていることを確認
    expect(screen.getByText('Sorry, something went wrong')).toBeInTheDocument()
  })
})