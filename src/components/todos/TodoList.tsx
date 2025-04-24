import { atom, useAtomValue, useSetAtom } from 'jotai'
import { FormEvent } from 'react'
import { v4 as uuidv4 } from "uuid";
import { filteredToListAtom, todoListAtom } from './State'
import TodoItem from './TodoItem'
import Filter from './Filter'
import { Todo } from './Models'

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
  const setTodoList = useSetAtom(todoListAtom)

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
    setTodoList((prev) => [...prev, atom<Todo>({ title, completed: false, todoid: uuidv4() })])
  }

  return (
    <div className="w-1/2 mx-auto">
      <form onSubmit={add}>
        <Filter />
        <input name="inputTitle" placeholder="Type ..." className="w-full"/>
      </form>
      <div>
        {filterdTodoList.map((atom, index) => {
          return <TodoItem key={index} atom={atom} />
        })}
      </div>
    </div>
  )
}

export default TodoList