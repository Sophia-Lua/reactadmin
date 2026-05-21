import React, { useState, useEffect } from 'react'
import { Descriptions, Button, Card } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { parseTime } from '@/utils/ruoyi'

function OperLogDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const logData = location.state?.record || {}

  return (
    <div style={{ padding: 20 }}>
      <h3>操作日志详细</h3>
      <Card>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="操作模块">{logData.title}</Descriptions.Item>
          <Descriptions.Item label="请求地址">{logData.operUrl}</Descriptions.Item>
          <Descriptions.Item label="登录信息">{logData.operName} / {logData.operIp} / {logData.operLocation}</Descriptions.Item>
          <Descriptions.Item label="请求方式">{logData.requestMethod}</Descriptions.Item>
          <Descriptions.Item label="操作方法">{logData.method}</Descriptions.Item>
          <Descriptions.Item label="操作状态">{logData.status === 0 ? '正常' : '失败'}</Descriptions.Item>
          <Descriptions.Item label="操作时间">{parseTime(logData.operTime)}</Descriptions.Item>
          <Descriptions.Item label="操作类型">{logData.businessType}</Descriptions.Item>
          <Descriptions.Item label="请求参数" span={2}>{logData.operParam}</Descriptions.Item>
          <Descriptions.Item label="返回参数" span={2}>{logData.jsonResult}</Descriptions.Item>
          <Descriptions.Item label="错误消息" span={2}>{logData.errorMsg}</Descriptions.Item>
        </Descriptions>
      </Card>
      <div style={{ marginTop: 16 }}>
        <Button onClick={() => navigate(-1)}>返回</Button>
      </div>
    </div>
  )
}

export default OperLogDetail
