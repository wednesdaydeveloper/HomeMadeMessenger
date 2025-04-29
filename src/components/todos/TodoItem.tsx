import { PrimitiveAtom, useAtom } from 'jotai'
import { Todo } from './Models'
import React from 'react'

export type TodoItemProps = {
  todoItemAtom: PrimitiveAtom<Todo>
}

const TodoItem = ({ todoItemAtom }: TodoItemProps) => {
  const [todo, setTodo] = useAtom(todoItemAtom)

  const toggleCompleted = () =>
    setTodo((props) => ({ ...props, completed: !props.completed }))

  return (
    <div className="p-1 m-1 border border-slate-500">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleCompleted}
      />

      <span key={todo.id}>
        {todo.name}
      </span>
    </div>
  )
}

export default TodoItem