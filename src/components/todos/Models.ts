export type Todo = {
  title: string
  todoid: string
  completed: boolean
}

export enum FilterType {
  All = 1,
  Completed = 2,
  Incompleted = 3
}; 