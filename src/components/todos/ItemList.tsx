import { useAtomValue } from 'jotai'
import { filteredTodoListAtom } from './State'
import TodoItem from './TodoItem'

const ItemList = () => {
  const filterdTodoList = useAtomValue(filteredTodoListAtom)
  return (
    <div>
      {
        filterdTodoList.map((todoItemAtom, index) => (
          <TodoItem key={index} todoItemAtom={todoItemAtom} />
        ))
      }
    </div>
  )
}

export default ItemList