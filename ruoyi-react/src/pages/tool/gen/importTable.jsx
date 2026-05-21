import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { dbTableList, importTable } from '@/api/tool/gen'
import Pagination from '@/components/Pagination'

function ImportTable() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [tables, setTables] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, tableName: undefined, tableComment: undefined })

  useEffect(() => { getList() }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const res = await dbTableList(queryParams)
      setTables(res.rows || [])
      setTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const handleQuery = () => { setQueryParams(prev => ({ ...prev, pageNum: 1 })); getList() }
  const resetQuery = () => { form.resetFields(); handleQuery() }
  const handlePageChange = ({ page, pageSize }) => { setQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getList() }

  const handleImport = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要导入的表')
      return
    }
    await importTable({ tables: selectedRowKeys.join(',') })
    message.success('导入成功')
    setSelectedRowKeys([])
    getList()
  }

  const columns = [
    { title: '表名称', dataIndex: 'tableName', key: 'tableName' },
    { title: '表描述', dataIndex: 'tableComment', key: 'tableComment' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  ]

  return (
    <div>
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="tableName" label="表名称"><Input placeholder="请输入表名称" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
        <Form.Item name="tableComment" label="表描述"><Input placeholder="请输入表描述" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
        <Form.Item><Space><Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
      </Form>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" disabled={selectedRowKeys.length === 0} onClick={handleImport}>导入</Button>
      </Space>
      <Table
        rowKey="tableName"
        loading={loading}
        dataSource={tables}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        pagination={false}
      />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />
    </div>
  )
}

export default ImportTable
