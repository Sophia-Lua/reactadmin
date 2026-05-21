import React from 'react'
import { Form, Input, Select, Switch, Collapse } from 'antd'

const { Panel } = Collapse

function RightPanel({ formData, onChange }) {
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="组件属性" key="1">
        <Form layout="vertical" onValuesChange={(_, values) => onChange?.(values)}>
          <Form.Item name="label" label="标签" initialValue={formData?.label}>
            <Input placeholder="请输入标签" />
          </Form.Item>
          <Form.Item name="type" label="类型" initialValue={formData?.type}>
            <Input placeholder="请输入类型" />
          </Form.Item>
          <Form.Item name="required" label="必填" valuePropName="checked" initialValue={formData?.required}>
            <Switch />
          </Form.Item>
          <Form.Item name="placeholder" label="占位符" initialValue={formData?.placeholder}>
            <Input placeholder="请输入占位符" />
          </Form.Item>
        </Form>
      </Panel>
      <Panel header="事件配置" key="2">
        <Form layout="vertical">
          <Form.Item name="onClick" label="点击事件">
            <Input.TextArea placeholder="请输入点击事件处理函数" />
          </Form.Item>
          <Form.Item name="onChange" label="变更事件">
            <Input.TextArea placeholder="请输入变更事件处理函数" />
          </Form.Item>
        </Form>
      </Panel>
    </Collapse>
  )
}

export default RightPanel
