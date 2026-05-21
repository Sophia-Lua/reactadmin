import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Modal, Select, Popconfirm, message, Tabs } from 'antd'
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { listDictType, getDictType, addDictType, updateDictType, delDictType, refreshCache } from '@/api/system/dict/type'
import { listDictData, getDictData, addDictData, updateDictData, delDictData } from '@/api/system/dict/data'
import Pagination from '@/components/Pagination'
import { parseTime, addDateRange } from '@/utils/ruoyi'
import { useNavigate } from 'react-router-dom'

function DictPage() {
  const [form] = Form.useForm()
  const [queryForm] = Form.useForm()
  const [dataForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [dictList, setDictList] = useState([])
  const [dataList, setDataList] = useState([])
  const [total, setTotal] = useState(0)
  const [dataTotal, setDataTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [dataSelectedRowKeys, setDataSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, dictName: undefined, dictType: undefined, status: undefined })
  const [dataQueryParams, setDataQueryParams] = useState({ pageNum: 1, pageSize: 10, dictType: undefined, dictLabel: undefined })
  const [open, setOpen] = useState(false)
  const [dataOpen, setDataOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [dataTitle, setDataTitle] = useState('')
  const [dateRange, setDateRange] = useState([])
  const [activeTab, setActiveTab] = useState('type')
  const navigate = useNavigate()

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const params = addDateRange(queryParams, dateRange)
      const res = await listDictType(params)
      setDictList(res.rows || [])
      setTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const getDataList = async () => {
    setLoading(true)
    try {
      const res = await listDictData(dataQueryParams)
      setDataList(res.rows || [])
      setDataTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const handleQuery = () => {
    setQueryParams(prev => ({ ...prev, pageNum: 1 }))
    getList()
  }

  const resetQuery = () => {
    queryForm.resetFields()
    setDateRange([])
    handleQuery()
  }

  const handleAdd = () => {
    reset()
    setTitle('添加字典类型')
    setOpen(true)
  }

  const handleUpdate = async (record) => {
    reset()
    const dictId = record.dictId || selectedRowKeys[0]
    const res = await getDictType(dictId)
    form.setFieldsValue(res.data)
    setTitle('修改字典类型')
    setOpen(true)
  }

  const handleDelete = async (record) => {
    const dictIds = record.dictId ? [record.dictId] : selectedRowKeys
    Modal.confirm({
      title: '确认删除',
      content: '是否确认删除字典编号为"' + dictIds + '"的数据项？',
      onOk: async () => {
        await delDictType(dictIds)
        message.success('删除成功')
        getList()
      },
    })
  }

  const handleSelectionChange = (keys) => setSelectedRowKeys(keys)
  const handleDataSelectionChange = (keys) => setDataSelectedRowKeys(keys)

  const handlePageChange = ({ page, pageSize }) => {
    setQueryParams(prev => ({ ...prev, pageNum: page, pageSize }))
    getList()
  }

  const handleDataPageChange = ({ page, pageSize }) => {
    setDataQueryParams(prev => ({ ...prev, pageNum: page, pageSize }))
    getDataList()
  }

  const handleRefreshCache = async () => {
    await refreshCache()
    message.success('刷新成功')
  }

  const handleDictData = (record) => {
    navigate(`/system/dict-data/index/${record.dictId}`, { state: { dictType: record.dictType } })
  }

  const reset = () => form.resetFields()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (values.dictId) {
        await updateDictType(values)
        message.success('修改成功')
      } else {
        await addDictType(values)
        message.success('新增成功')
      }
      setOpen(false)
      getList()
    } catch {}
  }

  const columns = [
    { title: '字典编号', dataIndex: 'dictId', key: 'dictId', width: 80 },
    { title: '字典名称', dataIndex: 'dictName', key: 'dictName' },
    { title: '字典类型', dataIndex: 'dictType', key: 'dictType' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (v) => v === '0' ? '正常' : '停用',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (text) => parseTime(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleDictData(record)}>字典数据</Button>
          <Button type="link" size="small" onClick={() => handleUpdate(record)}>修改</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const dataColumns = [
    { title: '字典编码', dataIndex: 'dictCode', key: 'dictCode', width: 100 },
    { title: '字典标签', dataIndex: 'dictLabel', key: 'dictLabel' },
    { title: '字典键值', dataIndex: 'dictValue', key: 'dictValue' },
    { title: '字典排序', dataIndex: 'dictSort', key: 'dictSort', width: 100 },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small">修改</Button>
          <Popconfirm title="确认删除？" onConfirm={async () => {
            await delDictData(record.dictCode)
            message.success('删除成功')
            getDataList()
          }}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="字典类型" key="type">
          {showSearch && (
            <Form form={queryForm} layout="inline" style={{ marginBottom: 16 }}>
              <Form.Item name="dictName" label="字典名称">
                <Input placeholder="请输入字典名称" onPressEnter={handleQuery} style={{ width: 200 }} />
              </Form.Item>
              <Form.Item name="dictType" label="字典类型">
                <Input placeholder="请输入字典类型" onPressEnter={handleQuery} style={{ width: 200 }} />
              </Form.Item>
              <Form.Item name="status" label="状态">
                <Select placeholder="状态" allowClear style={{ width: 120 }}>
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
          )}
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button>
            <Button type="primary" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleDelete({})}>删除</Button>
            <Button onClick={handleRefreshCache}>刷新缓存</Button>
          </Space>
          <Table rowKey="dictId" loading={loading} dataSource={dictList} columns={columns} rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }} pagination={false} />
          <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />
        </Tabs.TabPane>
      </Tabs>

      <Modal title={title} open={open} onOk={handleSubmit} onCancel={() => setOpen(false)} width={600} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="dictName" label="字典名称" rules={[{ required: true, message: '请输入字典名称' }]}>
            <Input placeholder="请输入字典名称" />
          </Form.Item>
          <Form.Item name="dictType" label="字典类型" rules={[{ required: true, message: '请输入字典类型' }]}>
            <Input placeholder="请输入字典类型" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value="0">正常</Select.Option>
              <Select.Option value="1">停用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DictPage
