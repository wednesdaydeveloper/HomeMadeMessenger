import React from 'react'
import { render, screen } from '@testing-library/react'
import { useSetAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import TodoList from '../TodoList'
import { subscribeChannel, todoListAtom, internalTodoListAtom } from '../State'
import '@testing-library/jest-dom'

// モックの設定
jest.mock('../Filter', () => jest.fn(() => <div data-testid="filter">Mocked Filter</div>))
jest.mock('../InputTodo', () => jest.fn(() => <div data-testid="input-todo">Mocked InputTodo</div>))
jest.mock('../ItemList', () => jest.fn(() => <div data-testid="item-list">Mocked ItemList</div>))

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useSetAtom: jest.fn(),
}))

jest.mock('jotai/utils', () => ({
  ...jest.requireActual('jotai/utils'),
  useResetAtom: jest.fn(),
}))

jest.mock('../State', () => ({
  ...jest.requireActual('../State'),
  subscribeChannel: jest.fn(),
}))

describe('TodoList Component', () => {
  let mockResetInternalTodoList: jest.Mock
  let mockRefreshTodoList: jest.Mock
  let mockSubscribeChannel: jest.Mock
  let mockUnsubscribe: jest.Mock

  beforeEach(() => {
    // モック関数を設定
    mockResetInternalTodoList = jest.fn()
    mockRefreshTodoList = jest.fn()
    mockUnsubscribe = jest.fn()
    mockSubscribeChannel = jest.fn(() => ({
      unsubscribe: mockUnsubscribe,
    }))

    // useSetAtom と useResetAtom のモック設定
    ;(useSetAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === todoListAtom) return mockRefreshTodoList
    })
    ;(useResetAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === internalTodoListAtom) return mockResetInternalTodoList
    })
    ;(subscribeChannel as jest.Mock).mockImplementation(mockSubscribeChannel)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the mocked components correctly', () => {
    // コンポーネントをレンダリング
    render(<TodoList />)
    screen.debug()

    // モックされたコンポーネントが正しく表示されていることを確認
    expect(screen.getByTestId('filter')).toBeInTheDocument()
    expect(screen.getByTestId('input-todo')).toBeInTheDocument()
    expect(screen.getByTestId('item-list')).toBeInTheDocument()

    expect(mockResetInternalTodoList).toHaveBeenCalledTimes(0)
    expect(mockRefreshTodoList).toHaveBeenCalledTimes(0)
    expect(mockSubscribeChannel).toHaveBeenCalledTimes(1)
    expect(mockSubscribeChannel).toHaveBeenCalledWith(expect.any(Function))
    expect(mockUnsubscribe).toHaveBeenCalledTimes(0)
  })

  it('subscribes and unsubscribes to the channel on mount and unmount', () => {
    // コンポーネントをレンダリング
    const { unmount } = render(<TodoList />)

    // subscribeChannel が呼び出されたことを確認
    expect(mockSubscribeChannel).toHaveBeenCalledTimes(1)

    // コンポーネントをアンマウント
    unmount()

    // チャンネルの unsubscribe が呼び出されたことを確認
    expect(mockResetInternalTodoList).toHaveBeenCalledTimes(0)
    expect(mockRefreshTodoList).toHaveBeenCalledTimes(0)
    expect(mockSubscribeChannel).toHaveBeenCalledTimes(1)
    expect(mockSubscribeChannel).toHaveBeenCalledWith(expect.any(Function))
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
    expect(mockUnsubscribe).toHaveBeenCalledWith()
  })

  it('refreshes the todo list when a realtime event is received', () => {
    // コンポーネントをレンダリング
    render(<TodoList />)

    // リアルタイムイベントをシミュレート
    const mockPayload = { new: { id: 1, content: 'Task', completed: false } }
    const refreshCallback = mockSubscribeChannel.mock.calls[0][0]
    refreshCallback(mockPayload)

    // internalTodoListAtom と todoListAtom がリセット・更新されることを確認
    expect(mockResetInternalTodoList).toHaveBeenCalledTimes(1)
    expect(mockResetInternalTodoList).toHaveBeenCalledWith()
    expect(mockRefreshTodoList).toHaveBeenCalledTimes(1)
    expect(mockRefreshTodoList).toHaveBeenCalledWith()
    expect(mockSubscribeChannel).toHaveBeenCalledTimes(1)
    expect(mockSubscribeChannel).toHaveBeenCalledWith(expect.any(Function))
    expect(mockUnsubscribe).toHaveBeenCalledTimes(0)
  })
})