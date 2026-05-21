import React, { useState, useEffect, useMemo } from 'react'
import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isHttp } from '@/utils/validate'

function TopNav() {
  const topbarRouters = useSelector(state => state.permission.topbarRouters || [])
  const theme = useSelector(state => state.settings.theme)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [visibleNumber, setVisibleNumber] = useState(5)

  useEffect(() => {
    const handleResize = () => {
      const width = document.body.getBoundingClientRect().width / 3
      setVisibleNumber(parseInt(width / 85, 10))
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const topMenus = useMemo(() => {
    const menus = []
    topbarRouters.forEach(menu => {
      if (menu.hidden !== true) {
        if (menu.path === '/' && menu.children && menu.children.length > 0) {
          menus.push(menu.children[0])
        } else {
          menus.push(menu)
        }
      }
    })
    return menus
  }, [topbarRouters])

  const activeMenu = useMemo(() => {
    const path = location.pathname
    if (path !== undefined && path.lastIndexOf("/") > 0) {
      const tmpPath = path.substring(1, path.length)
      return "/" + tmpPath.split('/')[0]
    }
    return path
  }, [location.pathname])

  const handleSelect = ({ key }) => {
    if (isHttp(key)) {
      window.open(key, "_blank")
    } else {
      navigate(key)
    }
  }

  const visibleItems = topMenus.slice(0, visibleNumber)
  const hiddenItems = topMenus.slice(visibleNumber)

  const menuItems = visibleItems.map(item => ({
    key: item.path,
    label: item.meta?.title || item.path,
    icon: item.meta?.icon && item.meta.icon !== '#' ? <span className="anticon">{item.meta.icon}</span> : null,
  }))

  if (hiddenItems.length > 0) {
    menuItems.push({
      key: 'more',
      label: '更多菜单',
      children: hiddenItems.map(item => ({
        key: item.path,
        label: item.meta?.title || item.path,
      })),
    })
  }

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[activeMenu]}
      items={menuItems}
      onClick={handleSelect}
      style={{ lineHeight: '50px', height: 50 }}
    />
  )
}

export default TopNav
