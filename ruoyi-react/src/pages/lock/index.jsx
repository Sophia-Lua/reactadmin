import React, { useState } from 'react'
import { Input, Button, Avatar } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { unLock } from '@/store/slices/lockSlice'
import { useNavigate } from 'react-router-dom'

function Lock() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userName = useSelector(state => state.user.name)
  const avatar = useSelector(state => state.user.avatar)
  const [password, setPassword] = useState('')

  const handleUnlock = () => {
    if (password) {
      dispatch(unLock())
      navigate('/')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.9)', padding: 40, borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <Avatar size={80} src={avatar || undefined} icon={!avatar ? <UserOutlined /> : undefined} />
        <h2 style={{ marginTop: 16 }}>{userName}</h2>
        <p style={{ color: '#666' }}>屏幕已锁定</p>
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="请输入密码解锁"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onPressEnter={handleUnlock}
          style={{ width: 300, marginTop: 16 }}
          size="large"
        />
        <Button type="primary" onClick={handleUnlock} style={{ marginTop: 16, width: 300 }} size="large">
          解锁
        </Button>
      </div>
    </div>
  )
}

export default Lock
