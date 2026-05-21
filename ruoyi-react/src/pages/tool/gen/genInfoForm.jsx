import React from 'react'
import { Form, Input, Select, Radio, TreeSelect } from 'antd'

function GenInfoForm({ form, data }) {
  React.useEffect(() => {
    if (data) form.setFieldsValue(data)
  }, [data, form])

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="tplCategory" label="生成模板">
        <Select>
          <Select.Option value="crud">单表（增删改查）</Select.Option>
          <Select.Option value="tree">树表（增删改查）</Select.Option>
          <Select.Option value="sub">主子表（增删改查）</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="tplWebType" label="前端类型">
        <Radio.Group>
          <Radio value="element-ui">Element UI</Radio>
          <Radio value="antd">Ant Design</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="packageName" label="生成包路径" rules={[{ required: true, message: '请输入生成包路径' }]}>
        <Input placeholder="如：com.ruoyi.system" />
      </Form.Item>
      <Form.Item name="moduleName" label="生成模块名" rules={[{ required: true, message: '请输入生成模块名' }]}>
        <Input placeholder="如：system" />
      </Form.Item>
      <Form.Item name="businessName" label="生成业务名" rules={[{ required: true, message: '请输入生成业务名' }]}>
        <Input placeholder="如：user" />
      </Form.Item>
      <Form.Item name="functionName" label="生成功能名" rules={[{ required: true, message: '请输入生成功能名' }]}>
        <Input placeholder="如：用户" />
      </Form.Item>
      <Form.Item name="genType" label="生成代码方式">
        <Radio.Group>
          <Radio value="0">下载zip</Radio>
          <Radio value="1">自定义路径</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="genPath" label="自定义路径">
        <Input placeholder="请输入自定义路径" />
      </Form.Item>
    </Form>
  )
}

export default GenInfoForm
