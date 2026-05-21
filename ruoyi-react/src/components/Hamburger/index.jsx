import React from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

function Hamburger({ isActive, onToggle, style = {} }) {
  return (
    <div
      className="hamburger-container"
      onClick={onToggle}
      style={{ padding: '0 15px', cursor: 'pointer', ...style }}
    >
      {isActive ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </div>
  )
}

export default Hamburger
