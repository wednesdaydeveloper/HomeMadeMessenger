import { useAtom } from 'jotai'
import { filterAtom } from './State'
import '@ant-design/v5-patch-for-react-19';
import { Radio } from 'antd'

const Filter = () => {
  const [filter, set] = useAtom(filterAtom)
  return (
    <Radio.Group onChange={(e) => set(parseInt(e.target.value))} value={filter.toString()}>
      <Radio value="1">All</Radio>
      <Radio value="2">Completed</Radio>
      <Radio value="3">Incompleted</Radio>
    </Radio.Group>
  )
}

export default Filter