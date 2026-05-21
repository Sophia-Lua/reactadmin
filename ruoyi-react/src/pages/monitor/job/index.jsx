import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Modal, Select, Popconfirm, message, Tag } from 'antd'
import { PlusOutlined, SearchOutlined, DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { listJob, getJob, addJob, updateJob, delJob, runJob, jobStatusChange } from '@/api/monitor/job'
import Pagination from '@/components/Pagination'
import { parseTime, addDateRange } from '@/utils/ruoyi'
import { useNavigate } from 'react-router-dom'

function JobPage() {
  const [form] = Form.useForm()
  const [queryForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [jobList, setJobList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, jobName: undefined, jobGroup: undefined, status: undefined })
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [dateRange, setDateRange] = useState([])
  const navigate = useNavigate()

  useEffect(() => { getList() }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const params = addDateRange(queryParams, dateRange)
      const res = await listJob(params)
      setJobList(res.rows || [])
      setTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const handleQuery = () => { setQueryParams(prev => ({ ...prev, pageNum: 1 })); getList() }
  const resetQuery = () => { queryForm.resetFields(); setDateRange([]); handleQuery() }

  const handleAdd = () => { reset(); setTitle('添加任务'); setOpen(true) }

  const handleUpdate = async (record) => {
    reset()
    const jobId = record.jobId || selectedRowKeys[0]
    const res = await getJob(jobId)
    form.setFieldsValue(res.data)
    setTitle('修改任务')
    setOpen(true)
  }

  const handleDelete = async (record) => {
    const jobIds = record.jobId ? [record.jobId] : selectedRowKeys
    Modal.confirm({
      title: '确认删除', content: '是否确认删除任务编号为"' + jobIds + '"的数据项？',
      onOk: async () => { await delJob(jobIds); message.success('删除成功'); getList() }
    })
  }

  const handleStatusChange = async (record) => {
    await jobStatusChange(record.jobId, record.status === '0' ? '1' : '0')
    message.success('修改成功')
    getList()
  }

  const handleRun = async (record) => {
    await runJob(record.jobId, record.jobGroup)
    message.success('执行成功')
  }

  const handleJobLog = (record) => {
    navigate(`/monitor/job-log/index/${record.jobId}`)
  }

  const handleSelectionChange = (keys) => setSelectedRowKeys(keys)
  const handlePageChange = ({ page, pageSize }) => { setQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getList() }
  const reset = () => form.resetFields()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (values.jobId) { await updateJob(values); message.success('修改成功') } else { await addJob(values); message.success('新增成功') }
      setOpen(false); getList()
    } catch {}
  }

  const columns = [
    { title: '任务编号', dataIndex: 'jobId', key: 'jobId', width: 80 },
    { title: '任务名称', dataIndex: 'jobName', key: 'jobName' },
    { title: '任务组名', dataIndex: 'jobGroup', key: 'jobGroup', width: 100 },
    { title: '调用目标字符串', dataIndex: 'invokeTarget', key: 'invokeTarget', ellipsis: true },
    { title: 'cron执行表达式', dataIndex: 'cronExpression', key: 'cronExpression', width: 150 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (status, record) => (
      <Select value={status} style={{ width: 80 }} onChange={(v) => handleStatusChange({ ...record, status: v })}>
        <Select.Option value="0">运行中</Select.Option>
        <Select.Option value="1">暂停</Select.Option>
      </Select>
    )},
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160, render: (t) => parseTime(t) },
    {
      title: '操作', key: 'action', width: 200, render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleRun(record)}><PlayCircleOutlined /></Button>
          <Button type="link" size="small" onClick={() => handleJobLog(record)}>日志</Button>
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
      {showSearch && (
        <Form form={queryForm} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="jobName" label="任务名称"><Input placeholder="请输入任务名称" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
          <Form.Item name="jobGroup" label="任务组名">
            <Select placeholder="任务组名" allowClear style={{ width: 120 }}>
              <Select.Option value="DEFAULT">默认</Select.Option>
              <Select.Option value="SYSTEM">系统</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="状态" allowClear style={{ width: 120 }}>
              <Select.Option value="0">运行中</Select.Option><Select.Option value="1">暂停</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item><Space><Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
        </Form>
      )}
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button>
        <Button type="primary" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleDelete({})}>删除</Button>
      </Space>
      <Table rowKey="jobId" loading={loading} dataSource={jobList} columns={columns} rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }} pagination={false} scroll={{ x: 'max-content' }} />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />
      <Modal title={title} open={open} onOk={handleSubmit} onCancel={() => setOpen(false)} width={700} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="jobName" label="任务名称" rules={[{ required: true }]}><Input placeholder="请输入任务名称" /></Form.Item>
          <Form.Item name="jobGroup" label="任务分组" rules={[{ required: true }]}>
            <Select><Select.Option value="DEFAULT">默认</Select.Option><Select.Option value="SYSTEM">系统</Select.Option></Select>
          </Form.Item>
          <Form.Item name="invokeTarget" label="调用方法" rules={[{ required: true }]}><Input placeholder="请输入调用方法" /></Form.Item>
          <Form.Item name="cronExpression" label="cron表达式" rules={[{ required: true }]}><Input placeholder="请输入cron表达式" /></Form.Item>
          <Form.Item name="misfirePolicy" label="执行策略">
            <Select><Select.Option value="1">立即执行</Select.Option><Select.Option value="2">执行一次</Select.Option><Select.Option value="3">放弃执行</Select.Option></Select>
          </Form.Item>
          <Form.Item name="concurrent" label="是否并发">
            <Select><Select.Option value="0">允许</Select.Option><Select.Option value="1">禁止</Select.Option></Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select><Select.Option value="0">运行中</Select.Option><Select.Option value="1">暂停</Select.Option></Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default JobPage
