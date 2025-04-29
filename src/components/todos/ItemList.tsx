import { useAtomValue } from 'jotai'
import { filteredToListAtom } from './State'
import TodoItem from './TodoItem'

const ItemList = () => {
  const filterdTodoList = useAtomValue(filteredToListAtom)
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