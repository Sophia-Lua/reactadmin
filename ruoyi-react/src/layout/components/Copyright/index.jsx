import React from 'react'
import Typography from 'antd/es/typography/Typography'

function Copyright() {
  return (
    <Typography.Text type="secondary" style={{ textAlign: 'center', padding: '10px 0', fontSize: 12, display: 'block' }}>
      Copyright © {new Date().getFullYear()} RuoYi
    </Typography.Text>
  )
}

export default Copyright
