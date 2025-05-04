import TodoList from '@/components/todos/TodoList'
import { Provider } from 'jotai'
import { StrictMode } from 'react'

export default async function TodoListPage() {
  return (
    <StrictMode>
      <Provider>
        <TodoList />
      </Provider>
    </StrictMode>
  )
}