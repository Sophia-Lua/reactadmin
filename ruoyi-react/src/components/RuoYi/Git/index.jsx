import React from 'react'
import { Tooltip } from 'antd'
import { GithubOutlined } from '@ant-design/icons'

function RuoYiGit() {
  const goto = () => window.open('https://gitee.com/y_project/RuoYi-Vue')
  return (
    <Tooltip title="仓库地址">
      <GithubOutlined onClick={goto} style={{ fontSize: 20, cursor: 'pointer' }} />
    </Tooltip>
  )
}

export default RuoYiGit
