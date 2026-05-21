import React, { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { updateUserPwd } from '@/api/system/user'

function ResetPwd() {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      await updateUserPwd(values.oldPassword, values.newPassword)
      message.success('修改成功')
      form.resetFields()
    } catch {}
  }

  return (
    <Form form={form} layout="vertical" style={{ maxWidth: 500 }} onFinish={handleSubmit}>
      <Form.Item name="oldPassword" label="旧密码" rules={[{ required: true, message: '请输入旧密码' }]}>
        <Input.Password placeholder="请输入旧密码" />
      </Form.Item>
      <Form.Item name="newPassword" label="新密码" rules={[{ required: true, message: '请输入新密码' }]}>
        <Input.Password placeholder="请输入新密码" />
      </Form.Item>
      <Form.Item name="confirmPassword" label="确认密码" rules={[
        { required: true, message: '请确认密码' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('newPassword') === value) return Promise.resolve()
            return Promise.reject(new Error('两次输入的密码不一致'))
          },
        }),
      ]}>
        <Input.Password placeholder="请确认密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">保存</Button>
      </Form.Item>
    </Form>
  )
}

export default ResetPwd
