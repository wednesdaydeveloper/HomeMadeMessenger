import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useAtom } from 'jotai'
import Filter from '../Filter'
import '@testing-library/jest-dom'

// モックの設定
jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtom: jest.fn(),
}))

describe('Filter Component', () => {
  let mockFilter: number
  let mockSetFilter: jest.Mock

  beforeEach(() => {
    // モックデータを設定
    mockFilter = 1 // 初期値は "All"
    mockSetFilter = jest.fn()

    // useAtom のモック設定
    ;(useAtom as jest.Mock).mockReturnValue([mockFilter, mockSetFilter])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('初期表示', () => {
    // コンポーネントをレンダリング
    render(<Filter />)

    // 各フィルタオプションが正しく表示されていることを確認
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Incompleted')).toBeInTheDocument()

    // 初期選択が "All" であることを確認
    expect((screen.getByLabelText('All') as HTMLInputElement).checked).toBe(true)
    expect((screen.getByLabelText('Completed') as HTMLInputElement).checked).toBe(false)
    expect((screen.getByLabelText('Incompleted') as HTMLInputElement).checked).toBe(false)
  })

  it('ラジオボタンをクリック', () => {
    // コンポーネントをレンダリング
    render(<Filter />)

    // "Completed" のラジオボタンをクリック
    fireEvent.click(screen.getByLabelText('Completed') as HTMLInputElement)

    // setFilter が正しい値で呼び出されたことを確認
    expect(mockSetFilter).toHaveBeenCalledTimes(1)
    expect(mockSetFilter).toHaveBeenNthCalledWith(1, 2)

    // "Incompleted" のラジオボタンをクリック
    fireEvent.click(screen.getByLabelText('Incompleted') as HTMLInputElement)

    // setFilter が正しい値で呼び出されたことを確認
    expect(mockSetFilter).toHaveBeenCalledTimes(2)
    expect(mockSetFilter).toHaveBeenNthCalledWith(1, 2)
    expect(mockSetFilter).toHaveBeenNthCalledWith(2, 3)
  })
})