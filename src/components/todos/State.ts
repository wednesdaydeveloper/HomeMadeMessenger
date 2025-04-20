import { atom } from 'jotai';
import type { PrimitiveAtom } from 'jotai'
import type { Todo } from './Models'
import { v4 as uuidv4 } from "uuid";

export const todoListState = atom<PrimitiveAtom<Todo>[]>([
  atom({ title: 'test1', todoid: uuidv4(), completed: false }),
  atom({ title: 'test2', todoid: uuidv4(), completed: false }),
  atom({ title: 'test3', todoid: uuidv4(), completed: false }),
]);

