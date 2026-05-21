import React, { useState, useEffect, useMemo } from 'react'
import { Tabs, Button, Space } from 'antd'
import CrontabSecond from './second'
import CrontabMin from './min'
import CrontabHour from './hour'
import CrontabDay from './day'
import CrontabMonth from './month'
import CrontabWeek from './week'
import CrontabYear from './year'
import CrontabResult from './result'

function Crontab({ expression, hideComponent = [], onFill, onHide }) {
  const [crontabValueObj, setCrontabValueObj] = useState({
    second: "*",
    min: "*",
    hour: "*",
    day: "*",
    month: "*",
    week: "?",
    year: "",
  })

  const [secondRadio, setSecondRadio] = useState(1)
  const [secondAverage, setSecondAverage] = useState({ a: 0, b: 1 })
  const [secondCycle, setSecondCycle] = useState({ a: 1, b: 2 })
  const [secondCheckbox, setSecondCheckbox] = useState([])

  const crontabValueString = useMemo(() => {
    const obj = crontabValueObj
    return `${obj.second} ${obj.min} ${obj.hour} ${obj.day} ${obj.month} ${obj.week}${obj.year === "" ? "" : " " + obj.year}`
  }, [crontabValueObj])

  const shouldHide = (key) => !hideComponent.includes(key)

  const changeRadio = (name, value) => {
    let insValue
    // Logic to set internal state based on crontab value
    // This is complex, so we will implement it directly in the sub-components via useEffect
    // For now, we just update the crontabValueObj
  }

  const updateCrontabValue = (name, value) => {
    setCrontabValueObj(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (expression) {
      const arr = expression.split(" ")
      if (arr.length >= 6) {
        const obj = {
          second: arr[0],
          min: arr[1],
          hour: arr[2],
          day: arr[3],
          month: arr[4],
          week: arr[5],
          year: arr[6] || "",
        }
        setCrontabValueObj(obj)
      }
    }
  }, [expression])

  const submitFill = () => {
    onFill && onFill(crontabValueString)
    onHide && onHide()
  }

  const clearCron = () => {
    setCrontabValueObj({
      second: "*",
      min: "*",
      hour: "*",
      day: "*",
      month: "*",
      week: "?",
      year: "",
    })
  }

  const tabItems = []
  if (shouldHide('second')) tabItems.push({ key: '1', label: '秒', children: <CrontabSecond cron={crontabValueObj} onChange={(v) => updateCrontabValue('second', v)} /> })
  if (shouldHide('min')) tabItems.push({ key: '2', label: '分钟', children: <CrontabMin cron={crontabValueObj} onChange={(v) => updateCrontabValue('min', v)} /> })
  if (shouldHide('hour')) tabItems.push({ key: '3', label: '小时', children: <CrontabHour cron={crontabValueObj} onChange={(v) => updateCrontabValue('hour', v)} /> })
  if (shouldHide('day')) tabItems.push({ key: '4', label: '日', children: <CrontabDay cron={crontabValueObj} onChange={(v) => updateCrontabValue('day', v)} /> })
  if (shouldHide('month')) tabItems.push({ key: '5', label: '月', children: <CrontabMonth cron={crontabValueObj} onChange={(v) => updateCrontabValue('month', v)} /> })
  if (shouldHide('week')) tabItems.push({ key: '6', label: '周', children: <CrontabWeek cron={crontabValueObj} onChange={(v) => updateCrontabValue('week', v)} /> })
  if (shouldHide('year')) tabItems.push({ key: '7', label: '年', children: <CrontabYear cron={crontabValueObj} onChange={(v) => updateCrontabValue('year', v)} /> })

  return (
    <div>
      <Tabs type="line" items={tabItems} />
      <div className="popup-main">
        <div className="popup-result">
          <p className="title">时间表达式</p>
          <table>
            <thead>
              <th width="40">秒</th>
              <th width="40">分钟</th>
              <th width="40">小时</th>
              <th width="40">日</th>
              <th width="40">月</th>
              <th width="40">周</th>
              <th width="40">年</th>
              <th>Cron 表达式</th>
            </thead>
            <tbody>
              <td><span>{crontabValueObj.second}</span></td>
              <td><span>{crontabValueObj.min}</span></td>
              <td><span>{crontabValueObj.hour}</span></td>
              <td><span>{crontabValueObj.day}</span></td>
              <td><span>{crontabValueObj.month}</span></td>
              <td><span>{crontabValueObj.week}</span></td>
              <td><span>{crontabValueObj.year}</span></td>
              <td><span>{crontabValueString}</span></td>
            </tbody>
          </table>
        </div>
        <CrontabResult ex={crontabValueString} />
        <div className="pop_btn" style={{ textAlign: 'center', marginTop: 20 }}>
          <Space>
            <Button type="primary" onClick={submitFill}>确定</Button>
            <Button danger onClick={clearCron}>重置</Button>
            <Button onClick={onHide}>取消</Button>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default Crontab
