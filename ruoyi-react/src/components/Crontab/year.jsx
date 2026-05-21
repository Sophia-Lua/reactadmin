import React, { useState, useEffect } from 'react'
import { Radio, Checkbox, InputNumber, DatePicker, Space } from 'antd'
import dayjs from 'dayjs'

function CrontabYear({ cron, onChange }) {
  const [radioValue, setRadioValue] = useState(1)
  const [startYear, setStartYear] = useState(dayjs().year())
  const [endYear, setEndYear] = useState(dayjs().year() + 10)
  const [checkboxList, setCheckboxList] = useState([])

  useEffect(() => { if (cron.year === '') setRadioValue(1) }, [cron.year])

  const handleChange = (val) => { setRadioValue(val); onChange && onChange('') }
  const handleCheckboxChange = (list) => { setCheckboxList(list); onChange && onChange(list.join(',')) }

  const currentYear = dayjs().year()
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({ label: String(currentYear + i), value: currentYear + i }))

  return (
    <div style={{ padding: 20 }}>
      <Radio.Group value={radioValue} onChange={(e) => handleChange(e.target.value)}>
        <Space direction="vertical">
          <Radio value={1}>为空 忽略年</Radio>
          <Radio value={2}>每年 允许的通配符[, - * /]</Radio>
          <Radio value={3}>周期 从
            <DatePicker size="small" picker="year" value={dayjs(String(startYear), 'YYYY')} onChange={d => setStartYear(d.year())} style={{ width: 100 }} />
            到
            <DatePicker size="small" picker="year" value={dayjs(String(endYear), 'YYYY')} onChange={d => setEndYear(d.year())} style={{ width: 100, margin: '0 10px' }} /></Radio>
          <Radio value={5}>指定 <Checkbox.Group options={yearOptions} value={checkboxList} onChange={handleCheckboxChange} /></Radio>
        </Space>
      </Radio.Group>
    </div>
  )
}

export default CrontabYear
