import { useAtomValue } from 'jotai'
import { filteredTodoListAtom } from './State'
import TodoItem from './TodoItem'
import { Suspense } from 'react'

const InternalItemList = () => {
  const filterdTodoList = useAtomValue(filteredTodoListAtom)
  return (
    <>
      {
        filterdTodoList.map((todoItemAtom, index) => (
          <TodoItem key={index} todoItemAtom={todoItemAtom} />
        ))
      }
    </>
  )
}

const ItemList = () => {
  return (
    <>
      <Suspense fallback={<h2>Loading...</h2>}>
        <InternalItemList />
      </Suspense>
    </>
  )
}

export default ItemList