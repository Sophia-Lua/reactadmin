import React, { useState, useEffect } from 'react'
import { ColorPicker } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { changeSetting } from '@/store/slices/settingsSlice'

function ThemePicker() {
  const theme = useSelector(state => state.settings.theme)
  const dispatch = useDispatch()

  const [color, setColor] = useState(theme)

  const handleColorChange = (color) => {
    const hexColor = color.toHexString()
    setColor(hexColor)
    dispatch(changeSetting({ key: 'theme', value: hexColor }))
  }

  return (
    <ColorPicker
      value={color}
      onChange={handleColorChange}
      presets={[
        {
          label: '推荐',
          colors: ['#409EFF', '#1890ff', '#304156', '#212121', '#11a983', '#13c2c2', '#6959CD', '#f5222d'],
        },
      ]}
    />
  )
}

export default ThemePicker
