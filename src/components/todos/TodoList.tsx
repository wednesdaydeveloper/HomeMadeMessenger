'use client'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { internalTodoListAtom, subscribeChannel, todoListAtom } from './State'
import Filter from './Filter'
import ItemList from './ItemList'
import { useResetAtom } from 'jotai/utils'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { Todo } from './Models'
import InputTodo from './InputTodo'

const TodoList = () => {
  const resetInternalTodoList = useResetAtom(internalTodoListAtom)
  const refreshTodoList = useSetAtom(todoListAtom)
  const refresh = (payload: RealtimePostgresChangesPayload<Todo>) => {
    console.log(payload)
    resetInternalTodoList()
    refreshTodoList()
  }

  useEffect(() => {
    const channelA = subscribeChannel(refresh)
    console.log("subscribe")
    return () => {
      channelA.unsubscribe()
      console.log("unsubscribe")
    }
  }, [])

  return (
    <div className="flex flex-col w-1/2 mx-auto">
      <Filter/>
      <InputTodo/>
      <ItemList />
    </div>
  )
}

export default TodoList