import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Dropdown, Avatar } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import HeaderSearch from '@/components/HeaderSearch'
import HeaderNotice from './HeaderNotice'
import { logoutAction } from '@/store/slices/userSlice'
import { useNavigate } from 'react-router-dom'

function Navbar({ onToggle }) {
  const sidebar = useSelector(state => state.app.sidebar)
  const userName = useSelector(state => state.user.name)
  const avatar = useSelector(state => state.user.avatar)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutAction())
    navigate('/login')
  }

  const items = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ]

  return (
    <div className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Hamburger isActive={!sidebar.opened} onToggle={onToggle} />
        <Breadcrumb />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <HeaderSearch />
        <Screenfull />
        <SizeSelect />
        <HeaderNotice />
        <Dropdown menu={{ items, onClick: ({ key }) => { if (key === 'logout') handleLogout() }}}>
          <div style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '6px 12px',
            borderRadius: '8px',
            transition: 'background 0.2s ease',
          }}>
            <Avatar
              src={avatar || undefined}
              icon={!avatar ? <UserOutlined /> : undefined}
              size="small"
              style={{ border: '2px solid #f0f0f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            />
            <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 500, color: '#595959' }}>{userName}</span>
          </div>
        </Dropdown>
      </div>
    </div>
  )
}

export default Navbar
