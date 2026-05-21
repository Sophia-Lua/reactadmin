import React, { useState, useEffect, useRef } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { loginAction, getInfoAction } from '@/store/slices/userSlice'
import { getCodeImg } from '@/api/login'
import './index.scss'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [codeUrl, setCodeUrl] = useState('')
  const [captchaEnabled, setCaptchaEnabled] = useState(true)
  const [loginForm, setLoginForm] = useState({
    username: 'admin',
    password: 'admin123',
    rememberMe: false,
    code: '',
    uuid: '',
  })

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    getCode()
  }, [])

  const getCode = async () => {
    try {
      const res = await getCodeImg()
      setCaptchaEnabled(res.captchaEnabled !== undefined ? res.captchaEnabled : true)
      if (captchaEnabled) {
        setCodeUrl('data:image/gif;base64,' + res.img)
        setLoginForm(prev => ({ ...prev, uuid: res.uuid }))
      }
    } catch {
      // ignore
    }
  }

  const handleLogin = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      await dispatch(loginAction({
        username: values.username,
        password: values.password,
        code: values.code,
        uuid: loginForm.uuid,
      })).unwrap()

      await dispatch(getInfoAction()).unwrap()

      message.success('登录成功')
      navigate(from, { replace: true })
    } catch (error) {
      if (captchaEnabled) {
        getCode()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <Form
        form={form}
        initialValues={loginForm}
        onFinish={handleLogin}
        className="login-form"
        size="large"
      >
        <div className="login-header">
          <img src="/logo.png" alt="Logo" className="login-logo" onError={(e) => e.target.style.display = 'none'} />
          <h3 className="title">若依管理系统</h3>
          <p className="subtitle">RuoYi Management System</p>
        </div>
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入您的账号' }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="账号"
            autoComplete="off"
            style={{ borderRadius: '8px', padding: '8px 12px' }}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入您的密码' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="密码"
            autoComplete="off"
            onPressEnter={handleLogin}
            style={{ borderRadius: '8px', padding: '8px 12px' }}
          />
        </Form.Item>
        {captchaEnabled && (
          <Form.Item
            name="code"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <div style={{ display: 'flex', gap: 12 }}>
              <Input
                prefix={<SafetyOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="验证码"
                style={{ flex: 1, borderRadius: '8px', padding: '8px 12px' }}
                autoComplete="off"
                onPressEnter={handleLogin}
              />
              <img
                src={codeUrl}
                alt="验证码"
                onClick={getCode}
                style={{ height: 40, cursor: 'pointer', borderRadius: '6px', border: '1px solid #f0f0f0', transition: 'transform 0.2s ease' }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
            </div>
          </Form.Item>
        )}
        <Form.Item name="rememberMe" valuePropName="checked" style={{ marginBottom: 16 }}>
          <Checkbox style={{ color: '#8c8c8c' }}>记住密码</Checkbox>
        </Form.Item>
        <Form.Item style={{ marginBottom: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              borderRadius: '8px',
              height: '48px',
              fontSize: '16px',
              fontWeight: 500,
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
              border: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? '登 录 中...' : '登 录'}
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <a href="/register" style={{ color: '#8c8c8c', fontSize: '14px' }}>还没有账号？立即注册</a>
        </div>
      </Form>
      <div className="el-login-footer">
        <span>Copyright © 2018-2024 ruoyi.vip All Rights Reserved.</span>
      </div>
    </div>
  )
}

export default Login
