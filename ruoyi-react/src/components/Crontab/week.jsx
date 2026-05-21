import React, { useState, useEffect } from 'react'
import { Radio, Checkbox, InputNumber, Select, Space } from 'antd'

function CrontabWeek({ cron, onChange }) {
  const [radioValue, setRadioValue] = useState(1)
  const [checkboxList, setCheckboxList] = useState([])
  useEffect(() => { if (cron.week === '?') setRadioValue(2); else if (cron.week === '*') setRadioValue(1) }, [cron.week])

  const handleChange = (val) => { setRadioValue(val); if (val === 2) onChange && onChange('?'); else onChange && onChange('*') }
  const handleCheckboxChange = (list) => { setCheckboxList(list); onChange && onChange(list.join(',')) }
  
  const weekOptions = [
    { label: '星期日', value: 1 }, { label: '星期一', value: 2 }, { label: '星期二', value: 3 },
    { label: '星期三', value: 4 }, { label: '星期四', value: 5 }, { label: '星期五', value: 6 }, { label: '星期六', value: 7 }
  ]

  return (
    <div style={{ padding: 20 }}>
      <Radio.Group value={radioValue} onChange={(e) => handleChange(e.target.value)}>
        <Space direction="vertical">
          <Radio value={1}>每周 允许的通配符[, - * ? L #]</Radio>
          <Radio value={2}>不指定</Radio>
          <Radio value={3}>周期 从星期
            <Select size="small" options={weekOptions} defaultValue={2} style={{ width: 80 }} />
            到星期
            <Select size="small" options={weekOptions} defaultValue={3} style={{ width: 80 }} /></Radio>
          <Radio value={4}>第
            <InputNumber size="small" min={1} max={4} defaultValue={1} style={{ width: 60 }} />
            周的星期
            <Select size="small" options={weekOptions} defaultValue={2} style={{ width: 80, margin: '0 5px' }} /></Radio>
          <Radio value={5}>本月最后一个星期
            <Select size="small" options={weekOptions} defaultValue={2} style={{ width: 80, margin: '0 5px' }} /></Radio>
          <Radio value={6}>指定 <Checkbox.Group options={weekOptions} value={checkboxList} onChange={handleCheckboxChange} /></Radio>
        </Space>
      </Radio.Group>
    </div>
  )
}

export default CrontabWeek
