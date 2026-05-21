import React from 'react'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

function RuoYiDoc() {
  const goto = () => window.open('http://doc.ruoyi.vip/ruoyi-vue')
  return (
    <Tooltip title="文档地址">
      <QuestionCircleOutlined onClick={goto} style={{ fontSize: 20, cursor: 'pointer' }} />
    </Tooltip>
  )
}

export default RuoYiDoc
