import React from 'react'
import { Tag } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { getDictData } from '@/store/slices/dictSlice'

function DictTag({ type, value }) {
  const dispatch = useDispatch()
  const dict = useSelector(state => state.dict.dict)

  React.useEffect(() => {
    if (type && !dict[type]) {
      dispatch(getDictData(type))
    }
  }, [type, dispatch, dict])

  if (!type || !value) return null

  const dictData = dict[type] || []
  const current = dictData.find(item => item.dictValue === String(value))

  if (!current) return <span>{value}</span>

  const colorMap = {
    default: 'default',
    primary: 'blue',
    success: 'green',
    info: 'cyan',
    warning: 'orange',
    danger: 'red',
  }

  return (
    <Tag color={colorMap[current.listClass] || 'default'}>
      {current.dictLabel}
    </Tag>
  )
}

export default DictTag
