import React from 'react'
import { Result } from 'antd'

function DruidPage() {
  return (
    <div style={{ height: 'calc(100vh - 120px)' }}>
      <iframe
        src={import.meta.env.VITE_APP_BASE_API + '/druid/index.html'}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Druid 数据源监控"
      />
    </div>
  )
}

export default DruidPage
