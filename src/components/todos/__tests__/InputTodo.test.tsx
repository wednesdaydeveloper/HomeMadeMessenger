import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSetAtom } from 'jotai'
import InputTodo from '../InputTodo'
import '@testing-library/jest-dom'

// モックの設定
jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useSetAtom: jest.fn(),
}))

describe('InputTodo Component', () => {
  let mockAddTodoList: jest.Mock

  beforeEach(() => {
    // モック関数を設定
    mockAddTodoList = jest.fn()
    ;(useSetAtom as jest.Mock).mockReturnValue(mockAddTodoList)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the input field and submits a valid todo', async () => {
    // コンポーネントをレンダリング
    render(<InputTodo />)

    // 入力フィールドを取得
    const input = screen.getByPlaceholderText('Type ...') as HTMLInputElement
    const form = input.closest('form') as HTMLFormElement

    // 入力フィールドに値を入力してフォームを送信
    fireEvent.change(input, { target: { value: 'New Task' } })
    fireEvent.submit(form)

    // addTodoList が正しい値で呼び出されたことを確認
    await waitFor(() => {
      expect(mockAddTodoList).toHaveBeenCalledWith('New Task')
      expect(screen.queryByText('contentを入力してください')).not.toBeInTheDocument()
      expect(mockAddTodoList).toHaveBeenCalled()
    })

    // 入力フィールドがクリアされていることを確認
    expect(input.value).toBe('')
  })

  it('shows validation error when the input is empty', async () => {
    // コンポーネントをレンダリング
    render(<InputTodo />)
    // フォームを送信
    const form = screen.getByTestId('form') as HTMLFormElement
    fireEvent.submit(form)

    // バリデーションエラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByTestId('error-message').textContent).toBe("contentを入力してください")
      expect(mockAddTodoList).not.toHaveBeenCalled()
    })
  })
})