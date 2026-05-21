import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Modal, Select, TreeSelect, Switch, Popconfirm, message } from 'antd'
import { PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import { listDept, getDept, deptTreeselect, addDept, updateDept, delDept } from '@/api/system/dept'
import { handleTree } from '@/utils/ruoyi'

function DeptPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [deptList, setDeptList] = useState([])
  const [queryParams, setQueryParams] = useState({ deptName: undefined, status: undefined })
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [deptOptions, setDeptOptions] = useState([])

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const res = await listDept(queryParams)
      setDeptList(handleTree(res.data || [], 'deptId'))
    } finally {
      setLoading(false)
    }
  }

  const getTreeselect = async () => {
    const res = await deptTreeselect()
    setDeptOptions(res.data || [])
  }

  const handleQuery = () => getList()

  const resetQuery = () => {
    setQueryParams({ deptName: undefined, status: undefined })
    getList()
  }

  const handleAdd = (record) => {
    reset()
    getTreeselect()
    if (record) form.setFieldsValue({ parentId: record.deptId })
    setTitle('添加部门')
    setOpen(true)
  }

  const handleUpdate = async (record) => {
    reset()
    getTreeselect()
    const res = await getDept(record.deptId)
    form.setFieldsValue(res.data)
    setTitle('修改部门')
    setOpen(true)
  }

  const handleDelete = async (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `是否确认删除名称为"${record.deptName}"的数据项？`,
      onOk: async () => {
        await delDept(record.deptId)
        message.success('删除成功')
        getList()
      },
    })
  }

  const reset = () => form.resetFields()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (values.deptId) {
        await updateDept(values)
        message.success('修改成功')
      } else {
        await addDept(values)
        message.success('新增成功')
      }
      setOpen(false)
      getList()
    } catch {}
  }

  const columns = [
    { title: '部门名称', dataIndex: 'deptName', key: 'deptName', width: 200 },
    { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 60 },
    { title: '负责人', dataIndex: 'leader', key: 'leader', width: 100 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (v) => v === '0' ? '正常' : '停用' },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleUpdate(record)}>修改</Button>
          <Button type="link" size="small" onClick={() => handleAdd(record)}>新增</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item label="部门名称">
          <Input placeholder="请输入部门名称" value={queryParams.deptName} onChange={(e) => setQueryParams({...queryParams, deptName: e.target.value})} onPressEnter={handleQuery} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="状态">
          <Select placeholder="状态" allowClear style={{ width: 120 }} value={queryParams.status} onChange={(v) => setQueryParams({...queryParams, status: v})}>
            <Select.Option value="0">正常</Select.Option>
            <Select.Option value="1">停用</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button>
            <Button onClick={resetQuery}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>新增</Button>
      </Space>

      <Table rowKey="deptId" loading={loading} dataSource={deptList} columns={columns} pagination={false} scroll={{ x: 'max-content' }} />

      <Modal title={title} open={open} onOk={handleSubmit} onCancel={() => setOpen(false)} width={600} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="parentId" label="上级部门">
            <TreeSelect treeData={deptOptions} fieldNames={{ label: 'label', value: 'id', children: 'children' }} placeholder="请选择上级部门" />
          </Form.Item>
          <Form.Item name="deptName" label="部门名称" rules={[{ required: true, message: '请输入部门名称' }]}>
            <Input placeholder="请输入部门名称" />
          </Form.Item>
          <Form.Item name="orderNum" label="显示排序" rules={[{ required: true, message: '请输入显示排序' }]}>
            <Input type="number" placeholder="请输入显示排序" />
          </Form.Item>
          <Form.Item name="leader" label="负责人">
            <Input placeholder="请输入负责人" />
          </Form.Item>
          <Form.Item name="phone" label="联系电话">
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value="0">正常</Select.Option>
              <Select.Option value="1">停用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DeptPage
