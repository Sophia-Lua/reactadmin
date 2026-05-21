import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, message, Modal } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { allocatedUserList, unallocatedUserList, authUserCancel, authUserCancelAll, authUserSelectAll } from '@/api/system/role'
import Pagination from '@/components/Pagination'
import SelectUser from './selectUser'

function AuthUser() {
  const { roleId } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [userList, setUserList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, userName: undefined, phonenumber: undefined, roleId })
  const [selectOpen, setSelectOpen] = useState(false)

  useEffect(() => { getList() }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const res = await allocatedUserList(queryParams)
      setUserList(res.rows || [])
      setTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const getSearchList = async () => {
    setLoading(true)
    try {
      const res = await unallocatedUserList(searchParams)
      setSearchUserList(res.rows || [])
      setSearchTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const handleQuery = () => { setQueryParams(prev => ({ ...prev, pageNum: 1 })); getList() }
  const resetQuery = () => { form.resetFields(); handleQuery() }

  const handleCancel = async (record) => {
    await authUserCancel({ roleId, userId: record.userId })
    message.success('取消授权成功')
    getList()
  }

  const handleCancelAll = async () => {
    await authUserCancelAll({ roleId, userIds: selectedRowKeys.join(',') })
    message.success('取消授权成功')
    setSelectedRowKeys([])
    getList()
  }

  const handleSearchQuery = () => { setSearchParams(prev => ({ ...prev, pageNum: 1 })); getSearchList() }
  const handleSearchPageChange = ({ page, pageSize }) => { setSearchParams(prev => ({ ...prev, pageNum: page, pageSize })); getSearchList() }
  const handlePageChange = ({ page, pageSize }) => { setQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getList() }

  const handleSelectAll = async () => {
    await authUserSelectAll({ roleId, userIds: searchSelectedKeys.join(',') })
    message.success('授权成功')
    setOpen(false)
    getList()
  }

  const columns = [
    { title: '用户名称', dataIndex: 'userName', key: 'userName' },
    { title: '手机', dataIndex: 'phonenumber', key: 'phonenumber' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v) => v === '0' ? '正常' : '停用' },
    {
      title: '操作', key: 'action', width: 100, render: (_, record) => (
        <Button type="link" size="small" onClick={() => handleCancel(record)}>取消授权</Button>
      ),
    },
  ]

  return (
    <div>
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="userName" label="用户名称"><Input placeholder="请输入用户名称" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
        <Form.Item name="phonenumber" label="手机号码"><Input placeholder="请输入手机号码" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
        <Form.Item><Space><Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
      </Form>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => { setOpen(true); getSearchList() }}>添加用户</Button>
        <Button danger disabled={selectedRowKeys.length === 0} onClick={handleCancelAll}>取消授权</Button>
        <Button onClick={() => navigate(-1)}>返回</Button>
      </Space>
      <Table rowKey="userId" loading={loading} dataSource={userList} columns={columns} rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }} pagination={false} />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />

      <Modal title="选择用户" open={open} onOk={handleSelectAll} onCancel={() => setOpen(false)} width={700}>
        <Table
          rowKey="userId"
          loading={loading}
          dataSource={searchUserList}
          columns={[
            { title: '用户名称', dataIndex: 'userName' },
            { title: '手机', dataIndex: 'phonenumber' },
          ]}
          rowSelection={{ selectedRowKeys: searchSelectedKeys, onChange: setSearchSelectedKeys }}
          pagination={false}
        />
        <Pagination total={searchTotal} page={searchParams.pageNum} pageSize={searchParams.pageSize} onPageChange={handleSearchPageChange} />
      </Modal>
    </div>
  )
}

export default AuthUser
