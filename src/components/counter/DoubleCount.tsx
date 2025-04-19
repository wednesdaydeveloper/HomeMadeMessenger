import { useAtomValue } from 'jotai';
import { doubleCountState } from './State';

export const DoubleCount = () => {
  const doubleCount = useAtomValue(doubleCountState);

  return <div>doubleCount: {doubleCount}</div>;
};