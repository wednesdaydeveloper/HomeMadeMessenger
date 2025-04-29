import { atom } from 'jotai';
import type { PrimitiveAtom } from 'jotai'
import { FilterType, type Todo } from './Models'
import { createClient } from '@/utils/supabase/client'

export const todoListAtom = atom<Promise<PrimitiveAtom<Todo>[]>>(
  async (get) => {
    const supabase = createClient()
    const { data: todos, error } = await supabase.from("todos").select();
    if (error) {
      return [];
    } else {
      const list = todos.map(todo => (atom({ name: todo.name, id: todo.id, completed: todo.completed })))
      console.log("list todolist: " + JSON.stringify(list))
      return list;
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