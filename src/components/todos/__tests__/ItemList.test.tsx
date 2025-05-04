// モックの設定
jest.mock('jotai', () => ({
  useAtomValue: jest.fn(),
}))

jest.mock('@/components/todos/State', () => ({
  filteredTodoListAtom: jest.fn(),
}))

import React from 'react'
import { render, screen } from '@testing-library/react'
import { useAtomValue } from 'jotai'
import ItemList from '@/components/todos/ItemList'

jest.mock('@/components/todos/TodoItem', () => jest.fn(() => <div data-testid="todo-item">Mocked TodoItem</div>))

describe('ItemList Component', () => {
  it('renders a list of TodoItem components when filteredTodoListAtom has data', () => {
    // モックデータを設定
    const mockTodoList = [
      { id: 1, content: 'Task 1', completed: false },
      { id: 2, content: 'Task 2', completed: true },
    ]
    ;(useAtomValue as jest.Mock).mockReturnValue(mockTodoList)

    // コンポーネントをレンダリング
    render(<ItemList />)
    screen.debug()

    // TodoItem が正しくレンダリングされていることを確認
    const todoItems = screen.getAllByTestId('todo-item')
    expect(todoItems).toHaveLength(mockTodoList.length)
  })

  it('renders an empty div when filteredTodoListAtom is empty', () => {
    // 空のモックデータを設定
    ;(useAtomValue as jest.Mock).mockReturnValue([])

    // コンポーネントをレンダリング
    render(<ItemList />)

    // TodoItem がレンダリングされていないことを確認
    const todoItems = screen.queryByTestId('todo-item')
    expect(todoItems).toBeNull()
  })
})