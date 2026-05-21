import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Modal, Select, Popconfirm, message } from 'antd'
import { PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import { listConfig, getConfig, addConfig, updateConfig, delConfig, refreshCache } from '@/api/system/config'
import Pagination from '@/components/Pagination'
import { parseTime, addDateRange } from '@/utils/ruoyi'

function ConfigPage() {
  const [form] = Form.useForm()
  const [queryForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [configList, setConfigList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, configName: undefined, configKey: undefined, configType: undefined })
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [dateRange, setDateRange] = useState([])

  useEffect(() => { getList() }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const params = addDateRange(queryParams, dateRange)
      const res = await listConfig(params)
      setConfigList(res.rows || [])
      setTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const handleQuery = () => { setQueryParams(prev => ({ ...prev, pageNum: 1 })); getList() }
  const resetQuery = () => { queryForm.resetFields(); setDateRange([]); handleQuery() }

  const handleAdd = () => { reset(); setTitle('添加参数'); setOpen(true) }

  const handleUpdate = async (record) => {
    reset()
    const configId = record.configId || selectedRowKeys[0]
    const res = await getConfig(configId)
    form.setFieldsValue(res.data)
    setTitle('修改参数')
    setOpen(true)
  }

  const handleDelete = async (record) => {
    const configIds = record.configId ? [record.configId] : selectedRowKeys
    Modal.confirm({
      title: '确认删除', content: '是否确认删除参数编号为"' + configIds + '"的数据项？',
      onOk: async () => { await delConfig(configIds); message.success('删除成功'); getList() }
    })
  }

  const handleRefreshCache = async () => {
    await refreshCache()
    message.success('刷新成功')
  }

  const handleSelectionChange = (keys) => setSelectedRowKeys(keys)
  const handlePageChange = ({ page, pageSize }) => { setQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getList() }
  const reset = () => form.resetFields()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (values.configId) { await updateConfig(values); message.success('修改成功') } else { await addConfig(values); message.success('新增成功') }
      setOpen(false); getList()
    } catch {}
  }

  const columns = [
    { title: '参数主键', dataIndex: 'configId', key: 'configId', width: 80 },
    { title: '参数名称', dataIndex: 'configName', key: 'configName' },
    { title: '参数键名', dataIndex: 'configKey', key: 'configKey' },
    { title: '参数键值', dataIndex: 'configValue', key: 'configValue' },
    { title: '系统内置', dataIndex: 'configType', key: 'configType', width: 100, render: (v) => v === 'Y' ? '是' : '否' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160, render: (t) => parseTime(t) },
    {
      title: '操作', key: 'action', width: 160, render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleUpdate(record)}>修改</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Form form={queryForm} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="configName" label="参数名称"><Input placeholder="请输入参数名称" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
        <Form.Item name="configKey" label="参数键名"><Input placeholder="请输入参数键名" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
        <Form.Item name="configType" label="系统内置">
          <Select placeholder="类型" allowClear style={{ width: 120 }}>
            <Select.Option value="Y">是</Select.Option><Select.Option value="N">否</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item><Space><Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
      </Form>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button>
        <Button type="primary" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleDelete({})}>删除</Button>
        <Button onClick={handleRefreshCache}>刷新缓存</Button>
      </Space>
      <Table rowKey="configId" loading={loading} dataSource={configList} columns={columns} rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }} pagination={false} />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />
      <Modal title={title} open={open} onOk={handleSubmit} onCancel={() => setOpen(false)} width={600} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="configName" label="参数名称" rules={[{ required: true, message: '请输入参数名称' }]}><Input placeholder="请输入参数名称" /></Form.Item>
          <Form.Item name="configKey" label="参数键名" rules={[{ required: true, message: '请输入参数键名' }]}><Input placeholder="请输入参数键名" /></Form.Item>
          <Form.Item name="configValue" label="参数键值" rules={[{ required: true, message: '请输入参数键值' }]}><Input placeholder="请输入参数键值" /></Form.Item>
          <Form.Item name="configType" label="系统内置">
            <Select><Select.Option value="Y">是</Select.Option><Select.Option value="N">否</Select.Option></Select>
          </Form.Item>
          <Form.Item name="remark" label="备注"><Input.TextArea placeholder="请输入备注" /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ConfigPage
