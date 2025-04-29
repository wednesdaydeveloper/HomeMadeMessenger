import { atom } from 'jotai';
import type { PrimitiveAtom } from 'jotai'
import { FilterType, type Todo } from './Models'
import { createClient } from '@/utils/supabase/client'

type TodoAtomType = PrimitiveAtom<Todo>
type InternalTodoAtomListType = TodoAtomType[] | undefined
type TodoListType = TodoAtomType[]

const internalTodoListAtom = atom<InternalTodoAtomListType>(undefined)


export const todoListAtom = atom<Promise<TodoListType>>(
  async (get) => {
    const internalTodoList = get(internalTodoListAtom);
    if (internalTodoList === undefined) {
      const supabase = createClient()
      const { data: todos, error } = await supabase.from("todos").select();
      if (error) {
        return [] as PrimitiveAtom<Todo>[];
      } else {
        const list = todos.map(todo => atom<Todo>({ 
          name: todo.name, 
          id: todo.id, 
          completed: todo.completed 
        }))
        console.log("list: " + JSON.stringify(list))
        return list;
      }
    }
    else {
      console.log("internalTodoList: " + JSON.stringify(internalTodoList))
      return internalTodoList;
    }
  }
)

export const addTodoListAtom = atom(
  null,
  async (get, set, update: TodoAtomType) => {
    const prev = get(internalTodoListAtom);
    if (prev === undefined) {
      const list = await get(todoListAtom);
      set(internalTodoListAtom, [...list, update]);
    } else {
      set(internalTodoListAtom, [...prev, update]);
    }
  }
)

export const filterAtom = atom(FilterType.All)

export const filteredToListAtom = atom(
  async (get) => {
    const filter = get(filterAtom)
    const todoList = await get(todoListAtom)
    if (filter === FilterType.All) {
      return todoList
    }
    else if (filter === FilterType.Completed) {
      return todoList.filter((atom) => get(atom).completed)
    }
    else {
      return todoList.filter((atom) => !get(atom).completed)
    }
  })