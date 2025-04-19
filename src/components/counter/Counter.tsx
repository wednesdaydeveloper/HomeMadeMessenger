'use client'

import { useAtom } from 'jotai'
import { incrementCountAction } from './State'
import { DoubleCount } from './DoubleCount'

const Counter = () => {
  const [count, incrementCount] = useAtom(incrementCountAction)

  return (
    <div className="card">
      <button onClick={incrementCount}>count is {count}</button>
      <DoubleCount />
    </div>
  )
}
export default Counter