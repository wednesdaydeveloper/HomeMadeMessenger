import { PrimitiveAtom, useAtom } from 'jotai'
import { Todo } from './Models'
import React from 'react'

export type TodoItemProps = {
  atom: PrimitiveAtom<Todo>
}

const TodoItem = ({ atom }: TodoItemProps) => {
  const [todo, setTodo] = useAtom(atom)

  const toggleCompleted = () =>
    setTodo((props) => ({ ...props, completed: !props.completed }))

  return (
    <>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={toggleCompleted}
        />

      <span key={todo.todoid}>
        {todo.title}
      </span>
    </>
  )
}

export default TodoItem