import { createStore } from 'jotai'
import { countState } from '@/components/counter/State'

const counterStore = createStore()
counterStore.set(countState, 1000)

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  )
}
