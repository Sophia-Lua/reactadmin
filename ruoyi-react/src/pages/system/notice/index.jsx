import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Modal, Select, Popconfirm, message } from 'antd'
import { PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import { listNotice, getNotice, addNotice, updateNotice, delNotice } from '@/api/system/notice'
import Pagination from '@/components/Pagination'
import Editor from '@/components/Editor'
import { parseTime, addDateRange } from '@/utils/ruoyi'

function NoticePage() {
  const [form] = Form.useForm()
  const [queryForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [noticeList, setNoticeList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, noticeTitle: undefined, noticeType: undefined, status: undefined })
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [dateRange, setDateRange] = useState([])
  const [editorContent, setEditorContent] = useState('')

  useEffect(() => { getList() }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const params = addDateRange(queryParams, dateRange)
      const res = await listNotice(params)
      setNoticeList(res.rows || [])
      setTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const handleQuery = () => { setQueryParams(prev => ({ ...prev, pageNum: 1 })); getList() }
  const resetQuery = () => { queryForm.resetFields(); setDateRange([]); handleQuery() }

  const handleAdd = () => { reset(); setEditorContent(''); setTitle('添加公告'); setOpen(true) }

  const handleUpdate = async (record) => {
    reset()
    const noticeId = record.noticeId || selectedRowKeys[0]
    const res = await getNotice(noticeId)
    form.setFieldsValue(res.data)
    setEditorContent(res.data.noticeContent || '')
    setTitle('修改公告')
    setOpen(true)
  }

  const handleDelete = async (record) => {
    const noticeIds = record.noticeId ? [record.noticeId] : selectedRowKeys
    Modal.confirm({
      title: '确认删除', content: '是否确认删除公告编号为"' + noticeIds + '"的数据项？',
      onOk: async () => { await delNotice(noticeIds); message.success('删除成功'); getList() }
    })
  }

  const handleSelectionChange = (keys) => setSelectedRowKeys(keys)
  const handlePageChange = ({ page, pageSize }) => { setQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getList() }
  const reset = () => form.resetFields()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const data = { ...values, noticeContent: editorContent }
      if (values.noticeId) { await updateNotice(data); message.success('修改成功') } else { await addNotice(data); message.success('新增成功') }
      setOpen(false); getList()
    } catch {}
  }

  const columns = [
    { title: '公告编号', dataIndex: 'noticeId', key: 'noticeId', width: 80 },
    { title: '公告标题', dataIndex: 'noticeTitle', key: 'noticeTitle' },
    { title: '公告类型', dataIndex: 'noticeType', key: 'noticeType', width: 100, render: (v) => v === '1' ? '通知' : '公告' },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (v) => v === '0' ? '正常' : '关闭' },
    { title: '创建者', dataIndex: 'createBy', key: 'createBy', width: 100 },
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
        <Form.Item name="noticeTitle" label="公告标题"><Input placeholder="请输入公告标题" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
        <Form.Item name="noticeType" label="公告类型">
          <Select placeholder="类型" allowClear style={{ width: 120 }}>
            <Select.Option value="1">通知</Select.Option><Select.Option value="2">公告</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="状态" allowClear style={{ width: 120 }}>
            <Select.Option value="0">正常</Select.Option><Select.Option value="1">关闭</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item><Space><Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
      </Form>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button>
        <Button type="primary" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleDelete({})}>删除</Button>
      </Space>
      <Table rowKey="noticeId" loading={loading} dataSource={noticeList} columns={columns} rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }} pagination={false} />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />
      <Modal title={title} open={open} onOk={handleSubmit} onCancel={() => setOpen(false)} width={700} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="noticeTitle" label="公告标题" rules={[{ required: true, message: '请输入公告标题' }]}><Input placeholder="请输入公告标题" /></Form.Item>
          <Form.Item name="noticeType" label="公告类型" rules={[{ required: true, message: '请选择公告类型' }]}>
            <Select><Select.Option value="1">通知</Select.Option><Select.Option value="2">公告</Select.Option></Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select><Select.Option value="0">正常</Select.Option><Select.Option value="1">关闭</Select.Option></Select>
          </Form.Item>
          <Form.Item name="noticeContent" label="内容">
            <Editor value={editorContent} onChange={setEditorContent} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default NoticePage
