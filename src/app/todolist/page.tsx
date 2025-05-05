import TodoList from '@/components/todos/TodoList'
import { Provider } from 'jotai'
import { StrictMode } from 'react'

const TodoListPage = () =>  {
  return (
    <StrictMode>
      <Provider>
        <TodoList />
      </Provider>
    </StrictMode>
  )
}

export default TodoListPage