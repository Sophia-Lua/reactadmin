import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Popconfirm, message, DatePicker, Modal, Select } from 'antd'
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import { listLoginLog, delLoginLog, delLoginLogAll, cleanLoginLog, unlockLoginLog } from '@/api/monitor/logininfor'
import Pagination from '@/components/Pagination'
import { parseTime, addDateRange } from '@/utils/ruoyi'

const { RangePicker } = DatePicker

function LoginLogPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [logList, setLogList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, ipaddr: undefined, userName: undefined, status: undefined })
  const [dateRange, setDateRange] = useState([])

  useEffect(() => { getList() }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const params = addDateRange(queryParams, dateRange)
      const res = await listLoginLog(params)
      setLogList(res.rows || [])
      setTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const handleQuery = () => { setQueryParams(prev => ({ ...prev, pageNum: 1 })); getList() }
  const resetQuery = () => { form.resetFields(); setDateRange([]); handleQuery() }

  const handleDelete = async (record) => {
    const infoIds = record.infoId ? [record.infoId] : selectedRowKeys
    Modal.confirm({
      title: '确认删除', content: '是否确认删除日志编号为"' + infoIds + '"的数据项？',
      onOk: async () => { await delLoginLog(infoIds); message.success('删除成功'); getList() }
    })
  }

  const handleClean = async () => {
    Modal.confirm({
      title: '确认清空', content: '是否确认清空所有登录日志？',
      onOk: async () => { await cleanLoginLog(); message.success('清空成功'); getList() }
    })
  }

  const handleUnlock = async (userName) => {
    await unlockLoginLog(userName)
    message.success('解锁成功')
  }

  const handleSelectionChange = (keys) => setSelectedRowKeys(keys)
  const handlePageChange = ({ page, pageSize }) => { setQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getList() }

  const columns = [
    { title: '访问编号', dataIndex: 'infoId', key: 'infoId', width: 80 },
    { title: '用户名称', dataIndex: 'userName', key: 'userName' },
    { title: '登录地址', dataIndex: 'ipaddr', key: 'ipaddr' },
    { title: '登录地点', dataIndex: 'loginLocation', key: 'loginLocation' },
    { title: '浏览器', dataIndex: 'browser', key: 'browser' },
    { title: '操作系统', dataIndex: 'os', key: 'os' },
    { title: '登录状态', dataIndex: 'status', key: 'status', width: 100, render: (v) => v === '0' ? '成功' : '失败' },
    { title: '操作信息', dataIndex: 'msg', key: 'msg' },
    { title: '登录日期', dataIndex: 'loginTime', key: 'loginTime', width: 160, render: (t) => parseTime(t) },
  ]

  return (
    <div>
      {showSearch && (
        <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="ipaddr" label="登录地址"><Input placeholder="请输入登录地址" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
          <Form.Item name="userName" label="用户名称"><Input placeholder="请输入用户名称" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="状态" allowClear style={{ width: 120 }}>
              <Select.Option value="0">成功</Select.Option><Select.Option value="1">失败</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="登录时间"><RangePicker value={dateRange} onChange={setDateRange} style={{ width: 240 }} /></Form.Item>
          <Form.Item><Space><Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
        </Form>
      )}
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleDelete({})}>删除</Button>
        <Button danger onClick={handleClean}>清空</Button>
      </Space>
      <Table rowKey="infoId" loading={loading} dataSource={logList} columns={columns} rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }} pagination={false} scroll={{ x: 'max-content' }} />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />
    </div>
  )
}

export default LoginLogPage
