'use client'
import { useSetAtom } from 'jotai'
import { FormEvent, Suspense, useEffect } from 'react'
import { addTodoListAtom, internalTodoListAtom, subscribeChannel, todoListAtom } from './State'
import Filter from './Filter'
import ItemList from './ItemList'
import { useResetAtom } from 'jotai/utils'

/**
 * Todoリストを表示・管理するコンポーネントです。
 * 
 * @description
 * - フィルター機能付きのTodoリストを表示します
 * - 新しいTodoアイテムの追加機能を提供します
 * - Jotaiを使用した状態管理を行います
 * - 各Todoアイテムは独立したatomとして管理されます
 * - リアルタイムでTodoリストの同期を行います
 */
const TodoList = () => {
  const addTodoList = useSetAtom(addTodoListAtom)
  const resetInternalTodoList = useResetAtom(internalTodoListAtom)
  const refreshTodoList = useSetAtom(todoListAtom)
  const refresh = (payload: any) => {
    console.log(payload)
    resetInternalTodoList()
    refreshTodoList()
  } 
  useEffect(() => {
    const channelA = subscribeChannel(refresh)
    console.log("subscribe")
    return () => {
      channelA.unsubscribe();
      console.log("unsubscribe")
    }
  }, [])

  const add = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const content = e.currentTarget.inputTitle.value
    e.currentTarget.inputTitle.value = ''
    addTodoList(content)
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