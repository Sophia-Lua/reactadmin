import React, { useState, useEffect } from 'react'
import { Radio, Checkbox, InputNumber, Space } from 'antd'

function CrontabDay({ cron, onChange }) {
  const [radioValue, setRadioValue] = useState(1)
  const [checkboxList, setCheckboxList] = useState([])
  useEffect(() => { if (cron.day === '*') setRadioValue(1) }, [cron.day])

  const handleChange = (val) => {
    setRadioValue(val)
    if (val === 1) onChange && onChange('*')
    else if (val === 2) onChange && onChange('?')
    else onChange && onChange('1')
  }
  const handleCheckboxChange = (list) => { setCheckboxList(list); onChange && onChange(list.join(',')) }
  const options = Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1), value: i + 1 }))

  return (
    <div style={{ padding: 20 }}>
      <Radio.Group value={radioValue} onChange={(e) => handleChange(e.target.value)}>
        <Space direction="vertical">
          <Radio value={1}>每日 允许的通配符[, - * ? / L W]</Radio>
          <Radio value={2}>不指定</Radio>
          <Radio value={3}>周期 从 <InputNumber size="small" min={1} max={31} defaultValue={1} style={{ width: 60 }} /> 到 <InputNumber size="small" min={1} max={31} defaultValue={2} style={{ width: 60 }} />-日</Radio>
          <Radio value={4}>从 <InputNumber size="small" min={1} max={31} defaultValue={1} style={{ width: 60 }} /> 日开始，每 <InputNumber size="small" min={1} max={31} defaultValue={1} style={{ width: 60 }} /> 日执行一次</Radio>
          <Radio value={5}>每月 <InputNumber size="small" min={1} max={31} defaultValue={1} style={{ width: 60 }} /> 号最近的那个工作日</Radio>
          <Radio value={6}>本月最后一天</Radio>
          <Radio value={7}>指定 <Checkbox.Group options={options} value={checkboxList} onChange={handleCheckboxChange} /></Radio>
        </Space>
      </Radio.Group>
    </div>
  )
}

export default CrontabDay
