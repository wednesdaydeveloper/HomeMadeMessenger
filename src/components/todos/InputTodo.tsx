import { useSetAtom } from 'jotai'
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import { TodoForm } from './Models'
import { addTodoListAtom } from './State'

const InputTodo =() => {
  const addTodoList = useSetAtom(addTodoListAtom)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoForm>()

  const isValid: SubmitHandler<TodoForm> = (data: TodoForm) => {
    console.log(data)

    reset()
    addTodoList(data.content)
  }

  const isInValid: SubmitErrorHandler<TodoForm> = (errors: any) => {
    console.log('errors: ' + JSON.stringify(errors.content.message))
  }

  return (
    <form onSubmit={handleSubmit(isValid, isInValid)} data-testid="form">

      <input {...register('content', { required: "contentを入力してください" })} name="content" placeholder="Type ..."  />

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