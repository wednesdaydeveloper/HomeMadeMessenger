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
        console.log("error: " + JSON.stringify(error))
        return [] as PrimitiveAtom<Todo>[];
      } else {
        const list = todos.map(todo => atom<Todo>({ 
          content: todo.content, 
          id: todo.id, 
          completed: todo.completed 
        }))
        console.log("list: " + JSON.stringify(list))
        return list;
      }
    }
    else {
      return internalTodoList;
    }
  }
)

export const addTodoListAtom = atom(
  null,
  async (get, set, content: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('todos')
      .upsert({ id: undefined, content })
      .select()
    if (error) {
      console.log("error: " + JSON.stringify(error))
    } else {
      const newAtom = atom<Todo>({ content, completed: false, id: data[0].id })
      const prev = get(internalTodoListAtom)
      const list = prev === undefined
        ? await get(todoListAtom)
        : prev
      set(internalTodoListAtom, [...list, newAtom]);
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