import React, { useState } from 'react'
import { Modal, Form, Input, Button, Space } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

function TreeNodeDialog({ open, onClose, onSave, treeData = [] }) {
  const [form] = Form.useForm()
  const [nodes, setNodes] = useState(treeData)

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      onSave?.({ ...values, nodes })
      onClose()
    } catch {}
  }

  const addNode = () => {
    setNodes([...nodes, { label: '', value: '' }])
  }

  const removeNode = (index) => {
    setNodes(nodes.filter((_, i) => i !== index))
  }

  return (
    <Modal title="树节点配置" open={open} onCancel={onClose} onOk={handleSave}>
      <Form form={form} layout="vertical">
        <Form.Item name="label" label="节点名称" rules={[{ required: true, message: '请输入节点名称' }]}>
          <Input placeholder="请输入节点名称" />
        </Form.Item>
        <Form.Item name="value" label="节点值" rules={[{ required: true, message: '请输入节点值' }]}>
          <Input placeholder="请输入节点值" />
        </Form.Item>
      </Form>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>子节点</span>
          <Button type="link" icon={<PlusOutlined />} onClick={addNode}>添加</Button>
        </div>
        {nodes.map((node, index) => (
          <Space key={index} style={{ marginBottom: 8 }}>
            <Input value={node.label} onChange={(e) => {
              const newNodes = [...nodes]
              newNodes[index].label = e.target.value
              setNodes(newNodes)
            }} placeholder="标签" style={{ width: 150 }} />
            <Input value={node.value} onChange={(e) => {
              const newNodes = [...nodes]
              newNodes[index].value = e.target.value
              setNodes(newNodes)
            }} placeholder="值" style={{ width: 150 }} />
            <Button danger icon={<DeleteOutlined />} onClick={() => removeNode(index)} />
          </Space>
        ))}
      </div>
    </Modal>
  )
}

export default TreeNodeDialog
