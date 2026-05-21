import React from 'react'
import { Link } from 'react-router-dom'

function Logo({ collapsed }) {
  return (
    <div className="sidebar-logo-container" style={{ height: 50, lineHeight: '50px', background: '#002140', textAlign: 'center', overflow: 'hidden' }}>
      <Link to="/">
        <img src="/logo.png" alt="logo" style={{ width: 32, height: 32, verticalAlign: 'middle' }} />
        {!collapsed && (
          <h1 style={{ display: 'inline-block', margin: '0 0 0 12px', fontSize: 16, fontWeight: 600, color: '#fff', verticalAlign: 'middle' }}>
            若依管理系统
          </h1>
        )}
      </Link>
    </div>
  )
}

export default Logo
