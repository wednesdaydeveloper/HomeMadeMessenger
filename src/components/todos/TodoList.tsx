import { useAtom } from 'jotai'
import { filteredToListAtom } from './State'
import TodoItem from './TodoItem'
import Filter from './Filter'

const TodoList = () => {
  const [todos] = useAtom(filteredToListAtom)
  return (
    <div>
      <Filter />

      {todos.map((atom, index) => {
        return <TodoItem key={index} atom={atom} />
      })}
    </div>
  )
}

export default TodoList