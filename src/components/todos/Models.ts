export type Todo = {
  id?: number
  content: string
  completed: boolean
}

export enum FilterType {
  All = 1,
  Completed = 2,
  Incompleted = 3
}; 

export interface TodoForm {
  content: string
}