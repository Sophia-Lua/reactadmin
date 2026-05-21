import React from 'react'
import { Form, Input } from 'antd'

function BasicInfoForm({ form, data }) {
  React.useEffect(() => {
    if (data) form.setFieldsValue(data)
  }, [data, form])

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="tableName" label="表名称" rules={[{ required: true, message: '请输入表名称' }]}>
        <Input placeholder="请输入表名称" />
      </Form.Item>
      <Form.Item name="tableComment" label="表描述" rules={[{ required: true, message: '请输入表描述' }]}>
        <Input placeholder="请输入表描述" />
      </Form.Item>
      <Form.Item name="className" label="实体类名称" rules={[{ required: true, message: '请输入实体类名称' }]}>
        <Input placeholder="请输入实体类名称" />
      </Form.Item>
      <Form.Item name="functionAuthor" label="功能作者">
        <Input placeholder="请输入功能作者" />
      </Form.Item>
      <Form.Item name="remark" label="备注">
        <Input.TextArea placeholder="请输入备注" rows={3} />
      </Form.Item>
    </Form>
  )
}

export default BasicInfoForm
