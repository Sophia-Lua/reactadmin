import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

function NotFound401() {
  const navigate = useNavigate()
  return (
    <Result
      status="403"
      title="401"
      subTitle="抱歉，您没有权限访问此页面。"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>返回首页</Button>
      }
    />
  )
}

export default NotFound401
