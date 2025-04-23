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
    <div className="p-1 m-1 border border-slate-500">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleCompleted}
      />

      <span key={todo.todoid}>
        {todo.title}
      </span>
    </div>
  )
}

export default TodoItem