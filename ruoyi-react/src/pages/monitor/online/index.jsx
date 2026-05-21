import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Popconfirm, message } from 'antd'
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import { listOnline, forceLogout } from '@/api/monitor/online'
import Pagination from '@/components/Pagination'
import { parseTime, addDateRange } from '@/utils/ruoyi'

function OnlinePage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [onlineList, setOnlineList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, ipaddr: undefined, userName: undefined })

  useEffect(() => { getList() }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const res = await listOnline(queryParams)
      setOnlineList(res.rows || [])
      setTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const handleQuery = () => { setQueryParams(prev => ({ ...prev, pageNum: 1 })); getList() }
  const resetQuery = () => { form.resetFields(); handleQuery() }

  const handleForceLogout = async (tokenId) => {
    await forceLogout(tokenId)
    message.success('强退成功')
    getList()
  }

  const handleSelectionChange = (keys) => setSelectedRowKeys(keys)
  const handlePageChange = ({ page, pageSize }) => { setQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getList() }

  const columns = [
    { title: '会话编号', dataIndex: 'tokenId', key: 'tokenId', ellipsis: true },
    { title: '用户名称', dataIndex: 'userName', key: 'userName' },
    { title: '部门名称', dataIndex: 'deptName', key: 'deptName' },
    { title: '主机', dataIndex: 'ipaddr', key: 'ipaddr' },
    { title: '登录地点', dataIndex: 'loginLocation', key: 'loginLocation' },
    { title: '浏览器', dataIndex: 'browser', key: 'browser' },
    { title: '操作系统', dataIndex: 'os', key: 'os' },
    { title: '登录时间', dataIndex: 'loginTime', key: 'loginTime', width: 160, render: (t) => parseTime(t) },
    {
      title: '操作', key: 'action', width: 100, render: (_, record) => (
        <Popconfirm title="确认强退？" onConfirm={() => handleForceLogout(record.tokenId)}>
          <Button type="link" size="small" danger>强退</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="ipaddr" label="登录地址"><Input placeholder="请输入登录地址" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
        <Form.Item name="userName" label="用户名称"><Input placeholder="请输入用户名称" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
        <Form.Item><Space><Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
      </Form>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => {
          selectedRowKeys.forEach(key => handleForceLogout(key))
        }}>批量强退</Button>
      </Space>
      <Table rowKey="tokenId" loading={loading} dataSource={onlineList} columns={columns} rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }} pagination={false} scroll={{ x: 'max-content' }} />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />
    </div>
  )
}

export default OnlinePage
