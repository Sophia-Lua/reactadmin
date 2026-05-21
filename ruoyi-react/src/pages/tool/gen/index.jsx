import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Popconfirm, message, DatePicker, Modal } from 'antd'
import { PlusOutlined, SearchOutlined, DeleteOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { listTable, getTable, delTable, genCode, downloadCode, synchDb, dbTableList, importTable } from '@/api/tool/gen'
import Pagination from '@/components/Pagination'
import { parseTime, addDateRange } from '@/utils/ruoyi'
import { useNavigate } from 'react-router-dom'

function GenPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [tableList, setTableList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, tableName: undefined, tableComment: undefined })
  const [dateRange, setDateRange] = useState([])
  const [importOpen, setImportOpen] = useState(false)
  const [dbTables, setDbTables] = useState([])
  const [dbTotal, setDbTotal] = useState(0)
  const [dbSelectedKeys, setDbSelectedKeys] = useState([])
  const [dbQueryParams, setDbQueryParams] = useState({ pageNum: 1, pageSize: 10, tableName: undefined, tableComment: undefined })
  const navigate = useNavigate()

  useEffect(() => { getList() }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const params = addDateRange(queryParams, dateRange)
      const res = await listTable(params)
      setTableList(res.rows || [])
      setTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const handleQuery = () => { setQueryParams(prev => ({ ...prev, pageNum: 1 })); getList() }
  const resetQuery = () => { form.resetFields(); setDateRange([]); handleQuery() }

  const handleDelete = async (record) => {
    const tableIds = record.tableId ? [record.tableId] : selectedRowKeys
    Modal.confirm({
      title: '确认删除', content: '是否确认删除表编号为"' + tableIds + '"的数据项？',
      onOk: async () => { await delTable(tableIds); message.success('删除成功'); getList() }
    })
  }

  const handleEdit = (record) => {
    navigate(`/tool/gen-edit/index/${record.tableId}`)
  }

  const handlePreview = async (record) => {
    const res = await previewTable(record.tableId)
    // Preview logic here
  }

  const handleGenCode = async (record) => {
    await genCode(record.tableName)
    message.success('生成成功')
  }

  const handleSynchDb = async (record) => {
    await synchDb(record.tableName)
    message.success('同步成功')
  }

  const handleImportDb = async () => {
    await importTable({ tables: dbSelectedKeys.join(',') })
    message.success('导入成功')
    setImportOpen(false)
    getList()
  }

  const getDbTableList = async () => {
    const res = await dbTableList(dbQueryParams)
    setDbTables(res.rows || [])
    setDbTotal(res.total || 0)
  }

  const handleSelectionChange = (keys) => setSelectedRowKeys(keys)
  const handlePageChange = ({ page, pageSize }) => { setQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getList() }

  const columns = [
    { title: '表名称', dataIndex: 'tableName', key: 'tableName' },
    { title: '表描述', dataIndex: 'tableComment', key: 'tableComment' },
    { title: '实体', dataIndex: 'className', key: 'className' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160, render: (t) => parseTime(t) },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 160, render: (t) => parseTime(t) },
    {
      title: '操作', key: 'action', width: 250, render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" size="small" onClick={() => handleDelete(record)}>删除</Button>
          <Button type="link" size="small" onClick={() => handleGenCode(record)}>生成</Button>
          <Button type="link" size="small" onClick={() => handleSynchDb(record)}>同步</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="tableName" label="表名称"><Input placeholder="请输入表名称" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
        <Form.Item name="tableComment" label="表描述"><Input placeholder="请输入表描述" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
        <Form.Item><Space><Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
      </Form>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<DownloadOutlined />} onClick={() => { setImportOpen(true); getDbTableList() }}>导入</Button>
        <Button type="primary" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleDelete({})}>删除</Button>
      </Space>
      <Table rowKey="tableId" loading={loading} dataSource={tableList} columns={columns} rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }} pagination={false} />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />

      <Modal title="导入表" open={importOpen} onOk={handleImportDb} onCancel={() => setImportOpen(false)} width={800}>
        <Table
          rowKey="tableName"
          loading={loading}
          dataSource={dbTables}
          columns={[{ title: '表名称', dataIndex: 'tableName' }, { title: '表描述', dataIndex: 'tableComment' }]}
          rowSelection={{ selectedRowKeys: dbSelectedKeys, onChange: setDbSelectedKeys }}
          pagination={false}
        />
        <Pagination total={dbTotal} page={dbQueryParams.pageNum} pageSize={dbQueryParams.pageSize} onPageChange={({ page, pageSize }) => { setDbQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getDbTableList() }} />
      </Modal>
    </div>
  )
}

export default GenPage
