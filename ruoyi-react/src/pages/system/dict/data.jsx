import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Modal, Select, Popconfirm, message } from 'antd'
import { PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import { listDictData, getDictData, addDictData, updateDictData, delDictData } from '@/api/system/dict/data'
import Pagination from '@/components/Pagination'

function DictDataPage() {
  const location = useLocation()
  const dictId = location.pathname.split('/').pop()
  const [form] = Form.useForm()
  const [queryForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, dictType: undefined, dictLabel: undefined })
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')

  useEffect(() => { getList() }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const res = await listDictData(queryParams)
      setDataList(res.rows || [])
      setTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const handleQuery = () => { setQueryParams(prev => ({ ...prev, pageNum: 1 })); getList() }
  const resetQuery = () => { queryForm.resetFields(); handleQuery() }
  const handleAdd = () => { form.resetFields(); setTitle('添加字典数据'); setOpen(true) }
  const handleUpdate = async (record) => {
    form.resetFields()
    const res = await getDictData(record.dictCode)
    form.setFieldsValue(res.data)
    setTitle('修改字典数据')
    setOpen(true)
  }
  const handleDelete = async (record) => {
    const dictCodes = record.dictCode ? [record.dictCode] : selectedRowKeys
    Modal.confirm({
      title: '确认删除', content: '是否确认删除字典编码为"' + dictCodes + '"的数据项？',
      onOk: async () => { await delDictData(dictCodes); message.success('删除成功'); getList() }
    })
  }
  const handleSelectionChange = (keys) => setSelectedRowKeys(keys)
  const handlePageChange = ({ page, pageSize }) => { setQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getList() }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (values.dictCode) { await updateDictData(values); message.success('修改成功') } else { await addDictData(values); message.success('新增成功') }
      setOpen(false); getList()
    } catch {}
  }

  const columns = [
    { title: '字典编码', dataIndex: 'dictCode', key: 'dictCode', width: 100 },
    { title: '字典标签', dataIndex: 'dictLabel', key: 'dictLabel' },
    { title: '字典键值', dataIndex: 'dictValue', key: 'dictValue' },
    { title: '字典排序', dataIndex: 'dictSort', key: 'dictSort', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (v) => v === '0' ? '正常' : '停用' },
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
        <Form.Item name="dictLabel" label="字典标签"><Input placeholder="请输入字典标签" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
        <Form.Item><Space><Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
      </Form>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button>
        <Button type="primary" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleDelete({})}>删除</Button>
      </Space>
      <Table rowKey="dictCode" loading={loading} dataSource={dataList} columns={columns} rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }} pagination={false} />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />
      <Modal title={title} open={open} onOk={handleSubmit} onCancel={() => setOpen(false)} width={600} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="dictLabel" label="字典标签" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="dictValue" label="字典键值" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="dictSort" label="字典排序"><Input type="number" /></Form.Item>
          <Form.Item name="status" label="状态">
            <Select><Select.Option value="0">正常</Select.Option><Select.Option value="1">停用</Select.Option></Select>
          </Form.Item>
          <Form.Item name="remark" label="备注"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DictDataPage
