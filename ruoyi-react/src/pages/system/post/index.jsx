import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Modal, Select, Popconfirm, message } from 'antd'
import { PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import { listPost, getPost, addPost, updatePost, delPost } from '@/api/system/post'
import Pagination from '@/components/Pagination'
import { parseTime, addDateRange } from '@/utils/ruoyi'

function PostPage() {
  const [form] = Form.useForm()
  const [queryForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [postList, setPostList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, postCode: undefined, postName: undefined, status: undefined })
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [dateRange, setDateRange] = useState([])

  useEffect(() => { getList() }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const params = addDateRange(queryParams, dateRange)
      const res = await listPost(params)
      setPostList(res.rows || [])
      setTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const handleQuery = () => { setQueryParams(prev => ({ ...prev, pageNum: 1 })); getList() }
  const resetQuery = () => { queryForm.resetFields(); setDateRange([]); handleQuery() }

  const handleAdd = () => { reset(); setTitle('添加岗位'); setOpen(true) }

  const handleUpdate = async (record) => {
    reset()
    const postId = record.postId || selectedRowKeys[0]
    const res = await getPost(postId)
    form.setFieldsValue(res.data)
    setTitle('修改岗位')
    setOpen(true)
  }

  const handleDelete = async (record) => {
    const postIds = record.postId ? [record.postId] : selectedRowKeys
    Modal.confirm({
      title: '确认删除', content: '是否确认删除岗位编号为"' + postIds + '"的数据项？',
      onOk: async () => { await delPost(postIds); message.success('删除成功'); getList() }
    })
  }

  const handleSelectionChange = (keys) => setSelectedRowKeys(keys)
  const handlePageChange = ({ page, pageSize }) => { setQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getList() }
  const reset = () => form.resetFields()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (values.postId) { await updatePost(values); message.success('修改成功') } else { await addPost(values); message.success('新增成功') }
      setOpen(false); getList()
    } catch {}
  }

  const columns = [
    { title: '岗位编号', dataIndex: 'postId', key: 'postId', width: 80 },
    { title: '岗位编码', dataIndex: 'postCode', key: 'postCode' },
    { title: '岗位名称', dataIndex: 'postName', key: 'postName' },
    { title: '岗位排序', dataIndex: 'postSort', key: 'postSort', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (v) => v === '0' ? '正常' : '停用' },
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
      {showSearch && (
        <Form form={queryForm} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="postCode" label="岗位编码"><Input placeholder="请输入岗位编码" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
          <Form.Item name="postName" label="岗位名称"><Input placeholder="请输入岗位名称" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="状态" allowClear style={{ width: 120 }}>
              <Select.Option value="0">正常</Select.Option><Select.Option value="1">停用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item><Space><Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
        </Form>
      )}
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button>
        <Button type="primary" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleDelete({})}>删除</Button>
      </Space>
      <Table rowKey="postId" loading={loading} dataSource={postList} columns={columns} rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }} pagination={false} />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />
      <Modal title={title} open={open} onOk={handleSubmit} onCancel={() => setOpen(false)} width={600} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="postCode" label="岗位编码" rules={[{ required: true, message: '请输入岗位编码' }]}><Input placeholder="请输入岗位编码" /></Form.Item>
          <Form.Item name="postName" label="岗位名称" rules={[{ required: true, message: '请输入岗位名称' }]}><Input placeholder="请输入岗位名称" /></Form.Item>
          <Form.Item name="postSort" label="岗位排序" rules={[{ required: true, message: '请输入岗位排序' }]}><Input type="number" placeholder="请输入岗位排序" /></Form.Item>
          <Form.Item name="status" label="状态">
            <Select><Select.Option value="0">正常</Select.Option><Select.Option value="1">停用</Select.Option></Select>
          </Form.Item>
          <Form.Item name="remark" label="备注"><Input.TextArea placeholder="请输入备注" /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PostPage
