import React from 'react'
import { AutoComplete, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

function HeaderSearch() {
  const [value, setValue] = React.useState('')
  const [options, setOptions] = React.useState([])
  const navigate = useNavigate()

  // Mock menu search - in production, this should come from the route config
  const menuOptions = [
    { value: '/system/user', label: '用户管理' },
    { value: '/system/role', label: '角色管理' },
    { value: '/system/menu', label: '菜单管理' },
    { value: '/system/dept', label: '部门管理' },
    { value: '/system/dict', label: '字典管理' },
    { value: '/system/post', label: '岗位管理' },
    { value: '/system/config', label: '参数设置' },
    { value: '/system/notice', label: '通知公告' },
    { value: '/monitor/job', label: '定时任务' },
    { value: '/monitor/logininfor', label: '登录日志' },
    { value: '/monitor/operlog', label: '操作日志' },
    { value: '/monitor/online', label: '在线用户' },
    { value: '/monitor/server', label: '服务监控' },
    { value: '/monitor/cache', label: '缓存监控' },
  ]

  const handleSearch = (searchText) => {
    if (!searchText) {
      setOptions([])
      return
    }
    const filtered = menuOptions.filter(item =>
      item.label.toLowerCase().includes(searchText.toLowerCase())
    )
    setOptions(filtered)
  }

  const handleSelect = (value) => {
    navigate(value)
    setValue('')
    setOptions([])
  }

  return (
    <AutoComplete
      value={value}
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      onChange={setValue}
      style={{ width: 200, marginRight: 12 }}
      placeholder="搜索菜单"
    >
      <Input prefix={<SearchOutlined />} size="small" />
    </AutoComplete>
  )
}

export default HeaderSearch
