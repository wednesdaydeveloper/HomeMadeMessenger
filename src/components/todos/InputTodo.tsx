import { useSetAtom } from 'jotai'
import React, { useRef } from 'react'
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import { TodoForm } from './Models'
import { addTodoListAtom } from './State'

const InputTodo =() => {
  const addTodoList = useSetAtom(addTodoListAtom)
  const contentRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoForm>();

  const isValid: SubmitHandler<TodoForm> = (data: TodoForm) => {
    console.log(data)

    if (contentRef.current) {
      contentRef.current.value = ''
    }
    addTodoList(data.content)
  };

  const isInValid: SubmitErrorHandler<TodoForm> = (erros: any) => {
    console.log('errors: ' + JSON.stringify(erros.content.message));
  };

  const { ref, ...rest } = register('content', { required: "contentを入力してください" });

  return (
    <form onSubmit={handleSubmit(isValid, isInValid)} data-testid="form">

      <input {...rest} name="content" placeholder="Type ..." ref={(e) => {
        ref(e)
        contentRef.current = e
      }} />

      {errors.content && (
        <div
          className="flex rounded-lg bg-red-100 p-4 dark:bg-red-200"
          role="alert"
        >
          <div className="mt-1 ml-3 text-sm font-medium text-red-700 dark:text-red-800" data-testid="error-message">
            {errors.content.message}
          </div>
        </div>
      )}
    </form>
  )
}

export default InputTodo