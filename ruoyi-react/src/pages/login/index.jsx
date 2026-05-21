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
        <h3 className="title">若依管理系统</h3>
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入您的账号' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="账号"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入您的密码' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
            autoComplete="off"
            onPressEnter={handleLogin}
          />
        </Form.Item>
        {captchaEnabled && (
          <Form.Item
            name="code"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <Input
                prefix={<SafetyOutlined />}
                placeholder="验证码"
                style={{ flex: 1 }}
                autoComplete="off"
                onPressEnter={handleLogin}
              />
              <img
                src={codeUrl}
                alt="验证码"
                onClick={getCode}
                style={{ height: 40, cursor: 'pointer' }}
              />
            </div>
          </Form.Item>
        )}
        <Form.Item name="rememberMe" valuePropName="checked">
          <Checkbox>记住密码</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            {loading ? '登 录 中...' : '登 录'}
          </Button>
        </Form.Item>
      </Form>
      <div className="el-login-footer">
        <span>Copyright © 2018-2024 ruoyi.vip All Rights Reserved.</span>
      </div>
    </div>
  )
}

export default Login
