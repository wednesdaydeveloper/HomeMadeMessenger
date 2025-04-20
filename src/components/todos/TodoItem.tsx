import { PrimitiveAtom, useAtom } from 'jotai'
import { Todo } from './Models'
import React from 'react'


export type TodoItemProps = {
  atom: PrimitiveAtom<Todo>
}


const TodoItem = ({ atom }: TodoItemProps) => {
  const [item, setItem] = useAtom(atom)
  return (
    <>
      <span key={item.todoid}>
        {item.title}
      </span>
    </>
  )
}

export default TodoItem