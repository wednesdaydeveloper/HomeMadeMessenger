import React from 'react'
import { render, screen } from '@testing-library/react'
import TodoListPage from '../page'
import '@testing-library/jest-dom'

// モックの設定
jest.mock('@/components/todos/TodoList', () => jest.fn(() => <div data-testid="todo-list">Mocked TodoList</div>))

describe('TodoListPage Component', () => {
  it('renders the TodoList component within Provider and StrictMode', () => {
    // コンポーネントをレンダリング
    render(<TodoListPage />)
    screen.debug()
    // モックされた TodoList コンポーネントが正しく表示されていることを確認
    expect(screen.getByTestId('todo-list')).toBeInTheDocument()
  })
})