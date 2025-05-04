import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useAtom } from 'jotai'
import TodoItem from '../TodoItem'
import { PrimitiveAtom } from 'jotai'
import { Todo } from '../Models'
import '@testing-library/jest-dom'

// モックの設定
jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtom: jest.fn(),
}))

describe('TodoItem Component', () => {
  let mockTodo: Todo
  let mockSetTodo: jest.Mock
  let mockTodoAtom: PrimitiveAtom<Todo>

  beforeEach(() => {
    // モックデータを設定
    mockTodo = { id: 1, content: 'Test Task', completed: false }
    mockSetTodo = jest.fn()
    mockTodoAtom = {} as PrimitiveAtom<Todo> // ダミーの PrimitiveAtom 型

    // useAtom のモック設定
    ;(useAtom as jest.Mock).mockReturnValue([mockTodo, mockSetTodo])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the todo content and checkbox correctly', () => {
    // コンポーネントをレンダリング
    render(<TodoItem todoItemAtom={mockTodoAtom} />)
    // screen.debug()
    // Todo の内容が正しく表示されていることを確認
    expect(screen.getByTestId('content').textContent).toBe('Test Task')
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('toggles the completed state when the checkbox is clicked', () => {
    // コンポーネントをレンダリング
    render(<TodoItem todoItemAtom={mockTodoAtom} />)
    // screen.debug()

    // チェックボックスを取得
    const checkbox = screen.getByRole('checkbox')

    // チェックボックスをクリック
    fireEvent.click(checkbox)

    // setTodo が呼び出され、completed が反転していることを確認
    expect(mockSetTodo).toHaveBeenCalledWith({ id: 1, content: 'Test Task', completed: true })
  })

  it('handles multiple toggles of the completed state', () => {
    // コンポーネントをレンダリング
    render(<TodoItem todoItemAtom={mockTodoAtom} />)
    // screen.debug()

    // チェックボックスを取得
    const checkbox = screen.getByRole('checkbox')

    // チェックボックスをクリックして状態を切り替える
    fireEvent.click(checkbox)
    expect(mockSetTodo).toHaveBeenCalledTimes(1)
    expect(mockSetTodo).toHaveBeenNthCalledWith(1, { id: 1, content: 'Test Task', completed: true })
    mockTodo.completed = true // モックの状態を更新

    // 再度クリックして元に戻す
    fireEvent.click(checkbox)
    expect(mockSetTodo).toHaveBeenCalledTimes(2)
    expect(mockSetTodo).toHaveBeenNthCalledWith(1, { id: 1, content: 'Test Task', completed: true })
    expect(mockSetTodo).toHaveBeenNthCalledWith(2, { id: 1, content: 'Test Task', completed: false })
  })
})