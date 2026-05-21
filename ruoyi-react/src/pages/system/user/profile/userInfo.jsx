import React from 'react'
import { Form, Input, Button, Radio, message } from 'antd'
import { updateUserProfile } from '@/api/system/user'

function UserInfo({ userInfo, onUpdate }) {
  const [form] = Form.useForm()

  React.useEffect(() => {
    if (userInfo) {
      form.setFieldsValue(userInfo)
    }
  }, [userInfo, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      await updateUserProfile(values)
      message.success('修改成功')
      onUpdate?.()
    } catch {}
  }

  return (
    <Form form={form} layout="vertical" style={{ maxWidth: 500 }} onFinish={handleSubmit}>
      <Form.Item name="nickName" label="用户昵称" rules={[{ required: true, message: '请输入用户昵称' }]}>
        <Input placeholder="请输入用户昵称" />
      </Form.Item>
      <Form.Item name="phonenumber" label="手机号码" rules={[
        { pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号码' },
      ]}>
        <Input placeholder="请输入手机号码" />
      </Form.Item>
      <Form.Item name="email" label="邮箱" rules={[
        { type: 'email', message: '请输入正确的邮箱地址' },
      ]}>
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item name="sex" label="性别">
        <Radio.Group>
          <Radio value="0">男</Radio>
          <Radio value="1">女</Radio>
          <Radio value="2">未知</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">保存</Button>
      </Form.Item>
    </Form>
  )
}

export default UserInfo
