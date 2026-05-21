import React from 'react'
import { Select } from 'antd'
import { useDispatch } from 'react-redux'
import { setSize } from '@/store/slices/appSlice'

function SizeSelect() {
  const dispatch = useDispatch()
  const [size, setSizeState] = React.useState('middle')

  const options = [
    { value: 'small', label: '紧凑' },
    { value: 'middle', label: '默认' },
    { value: 'large', label: '宽松' },
  ]

  const handleChange = (value) => {
    setSizeState(value)
    dispatch(setSize(value))
  }

  return (
    <Select
      value={size}
      onChange={handleChange}
      options={options}
      style={{ width: 80 }}
      size="small"
      className="size-select"
    />
  )
}

export default SizeSelect
