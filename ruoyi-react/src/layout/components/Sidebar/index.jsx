import React from 'react'
import { useSelector } from 'react-redux'
import { Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import * as Icons from '@ant-design/icons'
import Logo from './Logo'

function Sidebar({ collapsed, isMobile, onToggle, showLogo }) {
  const sidebarRouters = useSelector(state => state.permission.sidebarRouters || [])
  const location = useLocation()

  // Convert menu items to Ant Design Menu format
  const menuItems = sidebarRouters.map(item => ({
    key: item.path,
    icon: item.meta?.icon ? renderIcon(item.meta.icon) : null,
    label: item.hidden ? null : (
      item.redirect && !item.children?.length
        ? <Link to={item.redirect}>{item.meta?.title}</Link>
        : <span>{item.meta?.title}</span>
    ),
    children: item.children?.filter(c => !c.hidden)?.map(child => ({
      key: item.path + '/' + child.path,
      icon: child.meta?.icon ? renderIcon(child.meta.icon) : null,
      label: <Link to={item.path + '/' + child.path}>{child.meta?.title}</Link>,
    })),
  })).filter(item => item.label !== null)

  function renderIcon(iconName) {
    const IconComponent = Icons[iconName.replace('svg-', '')] || Icons.AppstoreOutlined
    return <IconComponent />
  }

  return (
    <>
      {isMobile && collapsed && (
        <div
          className="sidebar-mask"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 998,
          }}
          onClick={onToggle}
        />
      )}
      <div
        className="sidebar-container"
        style={{
          width: collapsed ? 54 : 210,
          height: '100vh',
          position: isMobile ? 'fixed' : 'relative',
          left: 0,
          zIndex: 999,
          background: '#001529',
          overflow: 'auto',
          transition: 'width 0.2s',
        }}
      >
        {showLogo && <Logo collapsed={collapsed} />}
        <Menu
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          selectedKeys={[location.pathname]}
          defaultOpenKeys={[]}
          items={menuItems}
          style={{ borderRight: 'none' }}
        />
      </div>
    </>
  )
}

export default Sidebar
