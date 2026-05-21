import React, { useState, useEffect } from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { register, getCodeImg } from '@/api/login'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [codeUrl, setCodeUrl] = useState('')
  const [uuid, setUuid] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getCode()
  }, [])

  const getCode = async () => {
    try {
      const res = await getCodeImg()
      setCodeUrl('data:image/gif;base64,' + res.img)
      setUuid(res.uuid)
    } catch {
      // ignore
    }
  }

  const handleRegister = async (values) => {
    setLoading(true)
    try {
      await register({ ...values, uuid })
      message.success('注册成功，请登录')
      navigate('/login')
    } catch {
      getCode()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <Form
        form={form}
        onFinish={handleRegister}
        className="login-form"
        size="large"
      >
        <h3 className="title">若依管理系统</h3>
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入您的账号' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="账号" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入您的密码' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: '请确认密码' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
        </Form.Item>
        <Form.Item
          name="code"
          rules={[{ required: true, message: '请输入验证码' }]}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <Input prefix={<SafetyOutlined />} placeholder="验证码" style={{ flex: 1 }} />
            <img src={codeUrl} alt="验证码" onClick={getCode} style={{ height: 40, cursor: 'pointer' }} />
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {loading ? '注 册 中...' : '注 册'}
          </Button>
          <div style={{ marginTop: 8, textAlign: 'right' }}>
            <a onClick={() => navigate('/login')}>返回登录</a>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Register
