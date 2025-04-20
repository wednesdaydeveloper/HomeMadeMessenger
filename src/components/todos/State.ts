import { atom } from 'jotai';
import type { PrimitiveAtom } from 'jotai'
import { FilterType, type Todo } from './Models'
import { v4 as uuidv4 } from "uuid";

export const todoListAtom = atom<PrimitiveAtom<Todo>[]>([
  atom({ title: 'test1', todoid: uuidv4(), completed: false }),
  atom({ title: 'test2', todoid: uuidv4(), completed: true }),
  atom({ title: 'test3', todoid: uuidv4(), completed: false }),
]);

export const filterAtom = atom(FilterType.Completed)

export const filteredToListAtom = atom<PrimitiveAtom<Todo>[]>(
  (get) => {
    const filter = get(filterAtom)
    const todoList = get(todoListAtom)
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