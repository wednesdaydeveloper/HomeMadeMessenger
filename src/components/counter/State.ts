import { atom } from 'jotai';

// 引数が初期値になります
export const countState = atom(0);

export const incrementCountAction = atom(
  (get) => get(countState),
  (get, set) => set(countState, get(countState) + 1)
);

export const doubleCountState = atom(
  (get) => {
    const result = get(countState) * 2;
    return result;
  });