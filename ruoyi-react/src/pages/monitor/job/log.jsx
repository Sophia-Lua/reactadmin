import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Popconfirm, message, DatePicker, Modal } from 'antd'
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { listJobLog, delJobLog, delJobLogAll, cleanJobLog } from '@/api/monitor/job'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/ruoyi'

const { RangePicker } = DatePicker

function JobLogPage() {
  const { jobId } = useParams()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [logList, setLogList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, jobName: undefined, jobGroup: undefined, status: undefined })
  const [dateRange, setDateRange] = useState([])
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailData, setDetailData] = useState({})

  useEffect(() => { getList() }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const res = await listJobLog(queryParams)
      setLogList(res.rows || [])
      setTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const handleQuery = () => { setQueryParams(prev => ({ ...prev, pageNum: 1 })); getList() }
  const resetQuery = () => { form.resetFields(); setDateRange([]); handleQuery() }
  const handleDelete = async (record) => {
    const ids = record.jobLogId ? [record.jobLogId] : selectedRowKeys
    Modal.confirm({
      title: '确认删除', content: '是否确认删除日志编号为"' + ids + '"的数据项？',
      onOk: async () => { await delJobLog(ids); message.success('删除成功'); getList() }
    })
  }
  const handleClean = async () => {
    Modal.confirm({
      title: '确认清空', content: '是否确认清空所有调度日志？',
      onOk: async () => { await cleanJobLog(); message.success('清空成功'); getList() }
    })
  }
  const handleSelectionChange = (keys) => setSelectedRowKeys(keys)
  const handlePageChange = ({ page, pageSize }) => { setQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getList() }

  const columns = [
    { title: '日志编号', dataIndex: 'jobLogId', key: 'jobLogId', width: 80 },
    { title: '任务名称', dataIndex: 'jobName', key: 'jobName' },
    { title: '任务组名', dataIndex: 'jobGroup', key: 'jobGroup' },
    { title: '调用目标字符串', dataIndex: 'invokeTarget', key: 'invokeTarget', ellipsis: true },
    { title: '日志信息', dataIndex: 'jobMessage', key: 'jobMessage' },
    { title: '执行状态', dataIndex: 'status', key: 'status', width: 100, render: (v) => v === '0' ? '成功' : '失败' },
    { title: '执行时间', dataIndex: 'createTime', key: 'createTime', width: 160, render: (t) => parseTime(t) },
    {
      title: '操作', key: 'action', width: 100, render: (_, record) => (
        <Button type="link" size="small" onClick={() => { setDetailData(record); setDetailOpen(true) }}>详细</Button>
      ),
    },
  ]

  return (
    <div>
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="jobName" label="任务名称"><Input placeholder="请输入任务名称" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
        <Form.Item name="jobGroup" label="任务组名">
          <Select placeholder="任务组名" allowClear style={{ width: 120 }}>
            <Select.Option value="DEFAULT">默认</Select.Option><Select.Option value="SYSTEM">系统</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="状态" allowClear style={{ width: 100 }}>
            <Select.Option value="0">成功</Select.Option><Select.Option value="1">失败</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="执行时间"><RangePicker value={dateRange} onChange={setDateRange} style={{ width: 240 }} /></Form.Item>
        <Form.Item><Space><Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
      </Form>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleDelete({})}>删除</Button>
        <Button danger onClick={handleClean}>清空</Button>
      </Space>
      <Table rowKey="jobLogId" loading={loading} dataSource={logList} columns={columns} rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }} pagination={false} scroll={{ x: 'max-content' }} />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />
      <Modal title="调度日志详细" open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null} width={700}>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr><td style={{ padding: 8, fontWeight: 'bold', width: 120 }}>日志序号：</td><td style={{ padding: 8 }}>{detailData.jobLogId}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>任务名称：</td><td style={{ padding: 8 }}>{detailData.jobName}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>调用方法：</td><td style={{ padding: 8 }}>{detailData.invokeTarget}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>日志信息：</td><td style={{ padding: 8 }}>{detailData.jobMessage}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>执行状态：</td><td style={{ padding: 8 }}>{detailData.status === '0' ? '成功' : '失败'}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>执行时间：</td><td style={{ padding: 8 }}>{parseTime(detailData.createTime)}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>异常信息：</td><td style={{ padding: 8 }}>{detailData.exceptionInfo}</td></tr>
          </tbody>
        </table>
      </Modal>
    </div>
  )
}

export default JobLogPage
