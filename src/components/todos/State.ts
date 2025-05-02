import { atom } from 'jotai';
import type { PrimitiveAtom } from 'jotai'
import { FilterType, type Todo } from './Models'
import { createClient } from '@/utils/supabase/client'
import { atomWithReset, atomWithRefresh } from 'jotai/utils';

/**
 * TodoアイテムのPrimitiveAtom型を表す型定義です。
 * 個々のTodoアイテムをatomとして管理するために使用されます。
 * PrimitiveAtom<Todo>は、Todoオブジェクトを値として持つ基本的なatomを表します。
 */
type TodoAtomType = PrimitiveAtom<Todo>

/**
 * 内部的なTodoアイテムのatomリストの型定義です。
 * TodoAtomTypeの配列または未定義(undefined)を表します。
 * この型は主にinternalTodoListAtomの状態を表現するために使用され、
 * 初期状態（未定義）とTodoリストが読み込まれた後の状態を区別することができます。
 */
type InternalTodoAtomListType = TodoAtomType[] | undefined

/**
 * TodoリストのPrimitiveAtom型の配列を表す型定義です。
 * TodoAtomType（個々のTodoアイテムのatom）の配列として定義され、
 * アプリケーション全体でTodoリストの型を統一するために使用されます。
 */
type TodoListType = TodoAtomType[]

/**
 * Supabaseクライアントのインスタンスを作成します。
 * このクライアントを使用してTodoデータの読み書きを行います。
 */
const supabase = createClient()

/**
 * Todoリストの内部状態を管理するatomです。
 * atomWithResetを使用することで、状態を初期値(undefined)にリセットすることができます。
 * このatomはtodoListAtomによって参照され、Todoリストのキャッシュとして機能します。
 */
export const internalTodoListAtom = atomWithReset<InternalTodoAtomListType>(undefined)

/**
 * Todoリストを取得するためのatomです。
 * 内部のTodoリストが未定義の場合、Supabaseからデータを取得します。
 * 取得したデータは各Todoをatomで包んでリストとして返します。
 * 内部のTodoリストが定義済みの場合は、そのリストをそのまま返します。
 * @returns TodoのatomのリストのPromise
 */
export const todoListAtom = atomWithRefresh<Promise<TodoListType>>(
  async (get) => {
    const internalTodoList = get(internalTodoListAtom);
    if (internalTodoList === undefined) {
      const { data: todos, error } = await supabase
        .from("todos")
        .select()
        .order('id')
      if (error) {
        console.log("error: " + JSON.stringify(error))
        return []
      } else {
        const list = todos.map(todo => atomWithTodo({
          content: todo.content,
          id: todo.id,
          completed: todo.completed
        }))
        console.log("list: " + JSON.stringify(list))
        return list as TodoListType;
      }
    }
    else {
      return internalTodoList;
    }
  }
)

/**
 * Todo型の初期値を受け取り、Todoの読み取りと更新が可能なatomを生成します。
 * 更新時にはSupabaseのデータも同時に更新されます。
 * @param initialTodo - 初期Todo値
 * @returns Todoの読み取り/更新が可能なatom
 */
const atomWithTodo = (initialTodo: Todo) => {
  const todoAtom = atom<Todo>(initialTodo)
  return atom(
    (get) => get(todoAtom),
    (_get, set, todo: Todo) => {
      supabase
        .from("todos")
        .update({ completed: todo.completed })
        .eq('id', todo.id)
        .then(({error}) => {
          if (error) {
            console.log("error: " + JSON.stringify(error))
          }
          console.log("todo: " + JSON.stringify(todo))
          set(todoAtom, todo)
        })
    }
  )
}

/**
 * Todoリストに新しいTodoを追加するためのアクションatomです。
 * Supabaseにデータを追加し、成功した場合はローカルのTodoリストも更新します。
 * @param content - 追加するTodoの内容
 */
export const addTodoListAtom = atom(
  null,
  async (get, set, content: string) => {
    const { data, error } = await supabase
      .from('todos')
      .upsert({ id: undefined, content })
      .select()
    if (error) {
      console.log("error: " + JSON.stringify(error))
    } else {
      const newAtom = atomWithTodo({content, id: data[0].id, completed: false}) as TodoAtomType
      const prev = get(internalTodoListAtom)
      const list = prev === undefined
        ? await get(todoListAtom)
        : prev
      set(internalTodoListAtom, [...list, newAtom]);
    }
  }
)

export const filterAtom = atom(FilterType.All)

/**
 * フィルタリングされたTodoリストを取得するためのatomです。
 * filterAtomの値に基づいて、全て/完了済み/未完了のTodoをフィルタリングします。
 * 
 * @returns フィルタリングされたTodoリストを含むatom
 * - FilterType.All: 全てのTodoを返します
 * - FilterType.Completed: 完了済みのTodoのみを返します 
 * - FilterType.Active: 未完了のTodoのみを返します
 */
export const filteredTodoListAtom = atom(
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
  }
)

/**
 * Supabaseのリアルタイム更新をサブスクライブするためのユーティリティ関数です。
 * todosテーブルのINSERT、DELETE、UPDATEイベントを監視し、
 * 変更があった場合に指定されたコールバック関数を実行します。
 *
 * @param refresh - データベースの変更時に実行されるコールバック関数
 * @returns Supabaseのチャンネルサブスクリプション
 */
export const subscribeChannel = (refresh: (payload: any) => void) => {
  return supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'todos' }, refresh)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'todos' }, refresh)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'todos' }, refresh)
      .subscribe()
}