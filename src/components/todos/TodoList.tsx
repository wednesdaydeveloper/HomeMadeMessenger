import { useAtom } from 'jotai'
import { todoListState } from './State'
import TodoItem from './TodoItem'

const TodoList = () => {
  const [todos] = useAtom(todoListState)
  return (
    <div>
      {todos.map((atom, index) => {
        return <TodoItem key={index} atom={atom} />
      })}
    </div>
  )
}

export default TodoList