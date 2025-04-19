'use client'
import { StrictMode } from 'react'
import Counter from '@/components/counter/Counter';
import { Provider, createStore } from 'jotai';
import { countState } from '@/components/counter/State';

const counterStore = createStore();
counterStore.set(countState, 1000);

export default function Home() {
  return (
    <div>
      <StrictMode>
        <Counter />

        <Provider>
          <Counter />
        </Provider>

        <Provider store={counterStore}>
          <Counter />
        </Provider>
      </StrictMode>
    </div>
  );
}
