'use client'
import { useAtomValue } from 'jotai'
import { FormEvent } from 'react'
import { filteredToListAtom } from './State'
import TodoItem from './TodoItem'
import Filter from './Filter'

/**
 * Todoリストを表示・管理するコンポーネント
 * @description
 * - フィルター機能付きのTodoリストを表示
 * - 新しいTodoアイテムの追加機能を提供
 * - Jotaiを使用した状態管理
 * - 各Todoアイテムは独立したatomとして管理
 */
const TodoList = () => {
  const filterdTodoList = useAtomValue(filteredToListAtom)
  /**
   * 新しいTodoアイテムを追加する
   * @param e フォームのサブミットイベント
   * @description
   * 1. フォームのデフォルト動作を防止
   * 2. 入力されたタイトルを取得
   * 3. 入力フィールドをクリア
   * 4. 新しいTodoアイテムをリストに追加（UUIDを生成して完了状態はfalse）
   */
  const add = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const title = e.currentTarget.inputTitle.value
    e.currentTarget.inputTitle.value = ''
  }

  return (
    <form onSubmit={add} className="flex flex-col w-1/2 mx-auto">
      <Filter />
      <input name="inputTitle" placeholder="Type ..." />
      <div>
        {filterdTodoList.map((todoItemAtom, index) => {
          return <TodoItem key={index} todoItemAtom={todoItemAtom} />
        })}
      </div>
    </form>
  )
}

export default TodoList