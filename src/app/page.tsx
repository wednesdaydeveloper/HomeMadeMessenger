import { StrictMode, Suspense } from 'react'
import { Provider, createStore } from 'jotai';
import { countState } from '@/components/counter/State';
import TodoList from '@/components/todos/TodoList';

const counterStore = createStore();
counterStore.set(countState, 1000);

export default function Home() {
  return (
    <div>
      <StrictMode>
        <Provider>
          <Suspense fallback={<h2>Loading...</h2>}>
            <TodoList />
          </Suspense>
        </Provider>
      </StrictMode>
    </div>
  );
}
