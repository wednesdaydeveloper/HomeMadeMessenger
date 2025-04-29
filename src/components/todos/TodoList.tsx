'use client'
import { atom, useSetAtom } from 'jotai'
import { FormEvent, Suspense } from 'react'
import { addTodoListAtom } from './State'
import { Todo } from './Models'
import Filter from './Filter'
import ItemList from './ItemList'

/**
 * Todoリストを表示・管理するコンポーネント
 * @description
 * - フィルター機能付きのTodoリストを表示
 * - 新しいTodoアイテムの追加機能を提供
 * - Jotaiを使用した状態管理
 * - 各Todoアイテムは独立したatomとして管理
 */
const TodoList = () => {
  const addTodoList = useSetAtom(addTodoListAtom)

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
    const name = e.currentTarget.inputTitle.value
    e.currentTarget.inputTitle.value = ''
    addTodoList(atom<Todo>({ name, completed: false, id: undefined }))
  }

  return (
    <div className="flex flex-col w-1/2 mx-auto">
      <Filter />
      <form onSubmit={add}>
        <input name="inputTitle" placeholder="Type ..." />
      </form>
      <Suspense fallback={<h2>Loading...</h2>}>
        <ItemList />
      </Suspense>
    </div>
  )
}

export default TodoList