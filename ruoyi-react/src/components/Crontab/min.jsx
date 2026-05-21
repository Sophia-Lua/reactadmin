import CrontabSecond from './second'
import CrontabMin from './min'
import React, { useState, useEffect } from 'react'
import { Radio, Checkbox, InputNumber, Row, Col, Space } from 'antd'

function CrontabMin({ cron, onChange }) {
  const [radioValue, setRadioValue] = useState(1)
  const [checkboxList, setCheckboxList] = useState([])

  useEffect(() => { if (cron.min === '*') setRadioValue(1) }, [cron.min])

  const handleChange = (val) => { setRadioValue(val); onChange && onChange('*') }
  const handleCheckboxChange = (list) => { setCheckboxList(list); onChange && onChange(list.join(',')) }
  const options = Array.from({ length: 60 }, (_, i) => ({ label: String(i).padStart(2, '0'), value: i }))

  return (
    <div style={{ padding: 20 }}>
      <Radio.Group value={radioValue} onChange={(e) => handleChange(e.target.value)}>
        <Space direction="vertical">
          <Radio value={1}>每分钟 允许的通配符[, - * /]</Radio>
          <Radio value={2}>周期 从 <InputNumber size="small" min={1} max={59} defaultValue={1} style={{ width: 60 }} /> 到 <InputNumber size="small" min={1} max={59} defaultValue={2} style={{ width: 60 }} />-分</Radio>
          <Radio value={3}>从 <InputNumber size="small" min={0} max={59} defaultValue={0} style={{ width: 60 }} /> 分开始，每 <InputNumber size="small" min={1} max={59} defaultValue={1} style={{ width: 60 }} /> 分执行一次</Radio>
          <Radio value={4}>指定 <Checkbox.Group options={options} value={checkboxList} onChange={handleCheckboxChange} /></Radio>
        </Space>
      </Radio.Group>
    </div>
  )
}

export default CrontabMin
