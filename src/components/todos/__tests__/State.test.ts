jest.mock('@/utils/supabase/client')

import { createClient } from '@/utils/supabase/client'
import { todoListAtom, addTodoListAtom, internalTodoListAtom, atomWithTodo, filteredTodoListAtom, filterAtom, subscribeChannel } from '@/components/todos/State'
import { atom, createStore, PrimitiveAtom } from 'jotai'
import { FilterType, Todo } from '../Models'

describe('State.ts Supabase Mock Tests', () => {
  let mockSupabaseClient: any

  beforeEach(() => {
    // モックされた Supabase クライアントを設定
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      channel: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
    }
      // createClient のモックが mockSupabaseClient を返すように設定
      ; (createClient as jest.Mock).mockReturnValue(mockSupabaseClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('todoListAtom', () => {
    it('todoListAtom から値を取得', async () => {
      // モックデータを設定
      const mockTodos: Todo[] = [
        { id: 3, content: 'Task 3', completed: false },
        { id: 1, content: 'Task 1', completed: true },
        { id: 4, content: 'Task 4', completed: true },
      ]
      mockSupabaseClient.order.mockReturnValue(Promise.resolve({ data: mockTodos, error: null }))
  
      // Atom の値を取得
      const store = createStore()
      store.set(internalTodoListAtom, undefined)
      const todos = await store.get(todoListAtom)
  
      // Supabase クライアントが正しく呼び出されたことを確認
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('todos')
      expect(mockSupabaseClient.select).toHaveBeenCalled()
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('id')
      expect(mockSupabaseClient.update).not.toHaveBeenCalled()
      expect(mockSupabaseClient.eq).not.toHaveBeenCalled()
      expect(mockSupabaseClient.upsert).not.toHaveBeenCalled()
      expect(mockSupabaseClient.subscribe).not.toHaveBeenCalled()
  
      expect(todos).toHaveLength(mockTodos.length)
      for (const [index, element] of todos.entries()) {
        expect(store.get(element)).toEqual(mockTodos[index])
      };
    })
  
    it('todoListAtom から値を取得、ただしinternalTodoListAtomに値が設定済み', async () => {
      // モックデータを設定
      const mockTodos: PrimitiveAtom<Todo>[] = [
        atom({ id: 3, content: 'Task 3', completed: false }) as PrimitiveAtom<Todo>,
        atom({ id: 1, content: 'Task 1', completed: true }) as PrimitiveAtom<Todo>,
        atom({ id: 4, content: 'Task 4', completed: true }) as PrimitiveAtom<Todo>,
      ]
      mockSupabaseClient.order.mockReturnValue(Promise.resolve({ data: mockTodos, error: null }))
  
      // Atom の値を取得
      const store = createStore()
      store.set(internalTodoListAtom, mockTodos)
      const todos = await store.get(todoListAtom)
  
      // Supabase クライアントが正しく呼び出されたことを確認
      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
      expect(mockSupabaseClient.select).not.toHaveBeenCalled()
      expect(mockSupabaseClient.order).not.toHaveBeenCalled()
      expect(mockSupabaseClient.update).not.toHaveBeenCalled()
      expect(mockSupabaseClient.eq).not.toHaveBeenCalled()
      expect(mockSupabaseClient.upsert).not.toHaveBeenCalled()
      expect(mockSupabaseClient.subscribe).not.toHaveBeenCalled()
      expect(todos).toBe(mockTodos)
    })
  
    it('todoListAtom から値を取得、ただしエラー', async () => {
      // モックデータを設定
      mockSupabaseClient.order.mockReturnValue(Promise.resolve({ data: null, error: true }))
  
      // Atom の値を取得
      const store = createStore()
      store.set(internalTodoListAtom, undefined)
      const todos = await store.get(todoListAtom)
  
      // Supabase クライアントが正しく呼び出されたことを確認
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('todos')
      expect(mockSupabaseClient.select).toHaveBeenCalled()
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('id')
      expect(mockSupabaseClient.update).not.toHaveBeenCalled()
      expect(mockSupabaseClient.eq).not.toHaveBeenCalled()
      expect(mockSupabaseClient.upsert).not.toHaveBeenCalled()
      expect(mockSupabaseClient.subscribe).not.toHaveBeenCalled()
  
      expect(todos).toHaveLength(0)
    })
  })
  
  describe('addTodoListAtom', () => {
    
    it('addTodoListAtom 取得。正常系', async () => {
      // モックデータを設定
      const mockTodos: PrimitiveAtom<Todo>[] = [
        atom({ id: 3, content: 'Task 3', completed: false }) as PrimitiveAtom<Todo>,
        atom({ id: 1, content: 'Task 1', completed: true }) as PrimitiveAtom<Todo>,
        atom({ id: 4, content: 'Task 4', completed: true }) as PrimitiveAtom<Todo>,
      ]
      const mockNewTodo = { id: 5, content: 'New Task', completed: false }
      mockSupabaseClient.select.mockReturnValue(Promise.resolve({ data: [mockNewTodo], error: null }))

      // Atom の値を更新
      const store = createStore()
      store.set(internalTodoListAtom, mockTodos)
      await store.set(addTodoListAtom, 'New Task')

      // Supabase クライアントが正しく呼び出されたことを確認
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('todos')
      expect(mockSupabaseClient.select).toHaveBeenCalled()
      expect(mockSupabaseClient.order).not.toHaveBeenCalled()
      expect(mockSupabaseClient.update).not.toHaveBeenCalled()
      expect(mockSupabaseClient.eq).not.toHaveBeenCalled()
      expect(mockSupabaseClient.upsert).toHaveBeenCalledWith({ id: undefined, content: 'New Task' })
      expect(mockSupabaseClient.subscribe).not.toHaveBeenCalled()
      expect(mockSupabaseClient.channel).not.toHaveBeenCalled()
      expect(mockSupabaseClient.on).not.toHaveBeenCalled()

      const actuals = store.get(internalTodoListAtom) as PrimitiveAtom<Todo>[]

      const expected: Todo[] = [
        { id: 3, content: 'Task 3', completed: false },
        { id: 1, content: 'Task 1', completed: true },
        { id: 4, content: 'Task 4', completed: true },
        { id: 5, content: 'New Task', completed: false },
      ]
      expect(actuals).toHaveLength(expected.length)
      for (const [index, element] of actuals.entries()) {
        expect(store.get(element)).toEqual(expected[index])
      };
    })


    it('addTodoListAtom 取得。異常系', async () => {
      // モックデータを設定
      mockSupabaseClient.select.mockReturnValue(Promise.resolve({ data: undefined, error: true }))

      // Atom の値を更新
      const store = createStore()
      await store.set(addTodoListAtom, 'New Task')

      // Supabase クライアントが正しく呼び出されたことを確認
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('todos')
      expect(mockSupabaseClient.select).toHaveBeenCalled()
      expect(mockSupabaseClient.order).not.toHaveBeenCalled()
      expect(mockSupabaseClient.update).not.toHaveBeenCalled()
      expect(mockSupabaseClient.eq).not.toHaveBeenCalled()
      expect(mockSupabaseClient.upsert).toHaveBeenCalledWith({ id: undefined, content: 'New Task' })
      expect(mockSupabaseClient.subscribe).not.toHaveBeenCalled()
      expect(mockSupabaseClient.channel).not.toHaveBeenCalled()
      expect(mockSupabaseClient.on).not.toHaveBeenCalled()

      expect(store.get(internalTodoListAtom)).toBeUndefined()
    })

    it('addTodoListAtom 取得。正常系。internalTodoListAtomがundefined', async () => {
      // モックデータを設定
      const mockNewTodo = { id: 5, content: 'New Task', completed: false }
      mockSupabaseClient.select.mockReturnValue(Promise.resolve({ data: [mockNewTodo], error: null }))
      const mockTodos: PrimitiveAtom<Todo>[] = [
        atom({ id: 3, content: 'Task 3', completed: false }) as PrimitiveAtom<Todo>,
        atom({ id: 1, content: 'Task 1', completed: true }) as PrimitiveAtom<Todo>,
        atom({ id: 4, content: 'Task 4', completed: true }) as PrimitiveAtom<Todo>,
      ]

      // Atom の値を更新
      const store = createStore()
      await store.set(internalTodoListAtom, undefined)
      const todoListAtomSpy = jest.spyOn(todoListAtom, "read");
      todoListAtomSpy.mockReturnValue(Promise.resolve(mockTodos))

      await store.set(addTodoListAtom, 'New Task')

      // Supabase クライアントが正しく呼び出されたことを確認
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('todos')
      expect(mockSupabaseClient.select).toHaveBeenCalled()
      expect(mockSupabaseClient.order).not.toHaveBeenCalled()
      expect(mockSupabaseClient.update).not.toHaveBeenCalled()
      expect(mockSupabaseClient.eq).not.toHaveBeenCalled()
      expect(mockSupabaseClient.upsert).toHaveBeenCalledWith({ id: undefined, content: 'New Task' })
      expect(mockSupabaseClient.subscribe).not.toHaveBeenCalled()
      expect(mockSupabaseClient.channel).not.toHaveBeenCalled()
      expect(mockSupabaseClient.on).not.toHaveBeenCalled()

      const actuals = store.get(internalTodoListAtom) as PrimitiveAtom<Todo>[]

      const expected: Todo[] = [
        { id: 3, content: 'Task 3', completed: false },
        { id: 1, content: 'Task 1', completed: true },
        { id: 4, content: 'Task 4', completed: true },
        { id: 5, content: 'New Task', completed: false },
      ]
      expect(actuals).toHaveLength(expected.length)
      for (const [index, element] of actuals.entries()) {
        expect(store.get(element)).toEqual(expected[index])
      };
    })
  })
  
  describe('atomWithTodo', () => {
    let mockTodo: Todo
    let todoAtom: PrimitiveAtom<Todo>
    beforeEach(() => {
      mockTodo = { id: 1, content: 'Task 1', completed: false }
      todoAtom = atomWithTodo(mockTodo) as PrimitiveAtom<Todo>
    })


    it('atomWithTodo 値取得。正常系', () => {
      // モックデータを設定

      // Atom の値を取得
      const store = createStore()
      const todo = store.get(todoAtom)

      expect(todo).toEqual(mockTodo)

      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
      expect(mockSupabaseClient.select).not.toHaveBeenCalled()
      expect(mockSupabaseClient.order).not.toHaveBeenCalled()
      expect(mockSupabaseClient.update).not.toHaveBeenCalled()
      expect(mockSupabaseClient.eq).not.toHaveBeenCalled()
      expect(mockSupabaseClient.upsert).not.toHaveBeenCalled()
      expect(mockSupabaseClient.subscribe).not.toHaveBeenCalled()
      expect(mockSupabaseClient.channel).not.toHaveBeenCalled()
      expect(mockSupabaseClient.on).not.toHaveBeenCalled()
    })

    it('atomWithTodo 値設定。正常系', () => {
      // モックデータを設定
      mockSupabaseClient.eq.mockReturnValue(Promise.resolve({ data: [{ id: 1, content: 'Task 1', completed: true }], error: null }))

      // Atom の値を取得
      const store = createStore()
      store.set(todoAtom, { ...mockTodo, completed: true })

      // expect(store.get(todoAtom)).toEqual({ id: 1, content: 'Task 1', completed: true })

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('todos')
      expect(mockSupabaseClient.select).not.toHaveBeenCalled()
      expect(mockSupabaseClient.order).not.toHaveBeenCalled()
      expect(mockSupabaseClient.update).toHaveBeenCalledWith({ completed: true })
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 1)
      expect(mockSupabaseClient.upsert).not.toHaveBeenCalled()
      expect(mockSupabaseClient.subscribe).not.toHaveBeenCalled()
      expect(mockSupabaseClient.channel).not.toHaveBeenCalled()
      expect(mockSupabaseClient.on).not.toHaveBeenCalled()
    })
  
    it('atomWithTodo 値取得。異常系', async () => {
      // モックデータを設定
      mockSupabaseClient.eq.mockReturnValue(Promise.resolve({ data: null, error: true }))
  
      // Atom の値を取得
      const store = createStore()
      store.set(todoAtom, { ...mockTodo, completed: true })
  
      expect(store.get(todoAtom)).toEqual({ id: 1, content: 'Task 1', completed: false })

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('todos')
      expect(mockSupabaseClient.select).not.toHaveBeenCalled()
      expect(mockSupabaseClient.order).not.toHaveBeenCalled()
      expect(mockSupabaseClient.update).toHaveBeenCalledWith({ completed: true })
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 1)
      expect(mockSupabaseClient.upsert).not.toHaveBeenCalled()
      expect(mockSupabaseClient.subscribe).not.toHaveBeenCalled()
      expect(mockSupabaseClient.channel).not.toHaveBeenCalled()
      expect(mockSupabaseClient.on).not.toHaveBeenCalled()
    })
  })


  describe('filteredTodoListAtom', () => {
    const todoAtomList: PrimitiveAtom<Todo>[] = [
        atom({ id: 3, content: 'Task 3', completed: false }) as PrimitiveAtom<Todo>,
        atom({ id: 1, content: 'Task 1', completed: true }) as PrimitiveAtom<Todo>,
        atom({ id: 4, content: 'Task 4', completed: true }) as PrimitiveAtom<Todo>,
        atom({ id: 5, content: 'New Task', completed: false }) as PrimitiveAtom<Todo>,
    ]
    let todoListAtomSpy
    beforeEach(() => {
      todoListAtomSpy = jest.spyOn(todoListAtom, "read");
      todoListAtomSpy.mockReturnValue(Promise.resolve(todoAtomList))
    })


    it('FilterType.All', async () => {
      // モックデータを設定
  
      // Atom の値を取得
      const store = createStore()
      store.set(filterAtom, FilterType.All)
      const actuals = await store.get(filteredTodoListAtom)
    
      expect(actuals).toHaveLength(todoAtomList.length)
      for (const [index, element] of actuals.entries()) {
        expect(store.get(element)).toEqual(store.get(todoAtomList[index]))
      };
    })

    it('FilterType.Completed', async () => {
      // モックデータを設定
  
      // Atom の値を取得
      const store = createStore()
      store.set(filterAtom, FilterType.Completed)
      const actuals = await store.get(filteredTodoListAtom)
    
      const expected: PrimitiveAtom<Todo>[] = [
        // atom({ id: 3, content: 'Task 3', completed: false }) as PrimitiveAtom<Todo>,
        atom({ id: 1, content: 'Task 1', completed: true }) as PrimitiveAtom<Todo>,
        atom({ id: 4, content: 'Task 4', completed: true }) as PrimitiveAtom<Todo>,
        // atom({ id: 5, content: 'New Task', completed: false }) as PrimitiveAtom<Todo>,
    ]
      expect(actuals).toHaveLength(expected.length)
      for (const [index, element] of actuals.entries()) {
        expect(store.get(element)).toEqual(store.get(expected[index]))
      };
    })

    it('FilterType.Incompleted', async () => {
      // モックデータを設定
  
      // Atom の値を取得
      const store = createStore()
      store.set(filterAtom, FilterType.Incompleted)
      const actuals = await store.get(filteredTodoListAtom)
    
      const expected: PrimitiveAtom<Todo>[] = [
        atom({ id: 3, content: 'Task 3', completed: false }) as PrimitiveAtom<Todo>,
        // atom({ id: 1, content: 'Task 1', completed: true }) as PrimitiveAtom<Todo>,
        // atom({ id: 4, content: 'Task 4', completed: true }) as PrimitiveAtom<Todo>,
        atom({ id: 5, content: 'New Task', completed: false }) as PrimitiveAtom<Todo>,
    ]
      expect(actuals).toHaveLength(expected.length)
      for (const [index, element] of actuals.entries()) {
        expect(store.get(element)).toEqual(store.get(expected[index]))
      };
    })
  })

  describe('subscribeChannel', () => {

    it('should subscribe to the channel', () => {

      subscribeChannel(() => {})
        // Handle the payload here
      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
      expect(mockSupabaseClient.select).not.toHaveBeenCalled()
      expect(mockSupabaseClient.order).not.toHaveBeenCalled()
      expect(mockSupabaseClient.update).not.toHaveBeenCalled()
      expect(mockSupabaseClient.eq).not.toHaveBeenCalled()
      expect(mockSupabaseClient.upsert).not.toHaveBeenCalled()
      expect(mockSupabaseClient.subscribe).toHaveBeenCalled()
      expect(mockSupabaseClient.channel).toHaveBeenCalledWith('schema-db-changes')
      expect(mockSupabaseClient.on).toHaveBeenCalledWith('postgres_changes', { event: 'INSERT', schema: 'public', table: 'todos' }, expect.any(Function))
      expect(mockSupabaseClient.on).toHaveBeenCalledWith('postgres_changes', { event: 'DELETE', schema: 'public', table: 'todos' }, expect.any(Function)) 
      expect(mockSupabaseClient.on).toHaveBeenCalledWith('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'todos' }, expect.any(Function))
      expect(mockSupabaseClient.on).toHaveBeenCalledTimes(3)
    })
  })
})