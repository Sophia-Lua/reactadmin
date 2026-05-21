import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Table, Button, Space } from 'antd'
import { dbTableList, importTable } from '@/api/tool/gen'
import Pagination from '@/components/Pagination'

function CreateTable({ open, onClose, onSuccess }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [tables, setTables] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, tableName: undefined, tableComment: undefined })

  useEffect(() => {
    if (open) getList()
  }, [open])

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
    if (selectedRowKeys.length === 0) return
    await importTable({ tables: selectedRowKeys.join(',') })
    onSuccess?.()
    onClose()
  }

  const columns = [
    { title: '表名称', dataIndex: 'tableName', key: 'tableName' },
    { title: '表描述', dataIndex: 'tableComment', key: 'tableComment' },
  ]

  return (
    <Modal title="导入表" open={open} onCancel={onClose} onOk={handleImport} width={700}>
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="tableName" label="表名称"><Input placeholder="请输入表名称" onPressEnter={handleQuery} style={{ width: 180 }} /></Form.Item>
        <Form.Item name="tableComment" label="表描述"><Input placeholder="请输入表描述" onPressEnter={handleQuery} style={{ width: 180 }} /></Form.Item>
        <Form.Item><Space><Button onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
      </Form>
      <Table
        rowKey="tableName"
        loading={loading}
        dataSource={tables}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        pagination={false}
      />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />
    </Modal>
  )
}

export default CreateTable
