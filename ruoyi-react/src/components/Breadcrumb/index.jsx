import React, { useState, useEffect } from 'react'
import { Breadcrumb as AntBreadcrumb } from 'antd'
import { useLocation, Link } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons'

function BreadcrumbNav() {
  const location = useLocation()
  const [items, setItems] = useState([])

  const getBreadcrumbList = (pathname) => {
    const routeList = []
    const pathSnippets = pathname.split('/').filter(i => i)
    
    routeList.push({ path: '/', meta: { title: '首页' } })
    
    const titleMap = {
      'system': '系统管理',
      'user': '用户管理',
      'role': '角色管理',
      'menu': '菜单管理',
      'dept': '部门管理',
      'post': '岗位管理',
      'dict': '字典管理',
      'config': '参数设置',
      'notice': '通知公告',
      'monitor': '系统监控',
      'server': '服务监控',
      'cache': '缓存监控',
      'online': '在线用户',
      'logininfor': '登录日志',
      'operlog': '操作日志',
      'job': '定时任务',
      'tool': '系统工具',
      'gen': '代码生成',
      'build': '表单构建',
      'swagger': '系统接口',
      'profile': '个人中心',
      'index': '首页',
    }
    
    pathSnippets.forEach((_, index) => {
      const url = '/' + pathSnippets.slice(0, index + 1).join('/')
      const lastSnippet = pathSnippets[index]
      routeList.push({ path: url, meta: { title: titleMap[lastSnippet] || lastSnippet } })
    })
    
    return routeList
  }

  useEffect(() => {
    const list = getBreadcrumbList(location.pathname)
    const breadcrumbItems = list.map((item, index) => ({
      key: item.path,
      title: index < list.length - 1 ? (
        <Link to={item.path}>{item.meta?.title}</Link>
      ) : (
        <span>{item.meta?.title}</span>
      ),
    }))
    setItems(breadcrumbItems)
  }, [location.pathname])

  return <AntBreadcrumb items={items} style={{ marginLeft: 16 }} />
}

export default BreadcrumbNav
