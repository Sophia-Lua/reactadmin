import React, { useState, useEffect, useRef } from 'react'
import { Form, Input, Button, Table, Space, Modal, Select, DatePicker, message, Switch, Popconfirm, Tag } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons'
import { listUser, getUser, addUser, updateUser, delUser, changeUserStatus, resetUserPwd, deptTreeSelect } from '@/api/system/user'
import { listRole } from '@/api/system/role'
import Pagination from '@/components/Pagination'
import { parseTime, addDateRange, handleTree } from '@/utils/ruoyi'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

function UserPage() {
  const [form] = Form.useForm()
  const [queryForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [userList, setUserList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [deptOptions, setDeptOptions] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, userName: undefined, phonenumber: undefined, status: undefined, deptId: undefined })
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [dateRange, setDateRange] = useState([])
  const [deptId, setDeptId] = useState(undefined)

  useEffect(() => {
    getList()
    getDeptTree()
    getRoleList()
  }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const params = addDateRange(queryParams, dateRange)
      if (deptId) params.deptId = deptId
      const res = await listUser(params)
      setUserList(res.rows || [])
      setTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const getDeptTree = async () => {
    const res = await deptTreeSelect()
    setDeptOptions(handleTree(res.data || [], 'id'))
  }

  const getRoleList = async () => {
    const res = await listRole()
    setRoleOptions(res.rows || [])
  }

  const handleQuery = () => {
    setQueryParams(prev => ({ ...prev, pageNum: 1 }))
    getList()
  }

  const resetQuery = () => {
    queryForm.resetFields()
    setDateRange([])
    setDeptId(undefined)
    handleQuery()
  }

  const handleAdd = () => {
    reset()
    setTitle('添加用户')
    setOpen(true)
  }

  const handleUpdate = async (record) => {
    reset()
    const userId = record.userId || selectedRowKeys[0]
    const res = await getUser(userId)
    form.setFieldsValue({
      ...res.data,
      roleIds: res.data.roles?.map(r => r.roleId),
      postIds: res.data.posts?.map(p => p.postId),
    })
    setTitle('修改用户')
    setOpen(true)
  }

  const handleDelete = async (record) => {
    const userIds = record.userId ? [record.userId] : selectedRowKeys
    Modal.confirm({
      title: '确认删除',
      content: `是否确认删除用户编号为"${userIds}"的数据项？`,
      onOk: async () => {
        await delUser(userIds)
        message.success('删除成功')
        getList()
      },
    })
  }

  const handleStatusChange = async (record) => {
    const text = record.status === '0' ? '启用' : '停用'
    try {
      await changeUserStatus(record.userId, record.status === '0' ? '1' : '0')
      message.success(`已${text}用户`)
    } catch {
      record.status = record.status === '0' ? '1' : '0'
      setUserList([...userList])
    }
  }

  const handleSelectionChange = (keys) => {
    setSelectedRowKeys(keys)
  }

  const handlePageChange = ({ page, pageSize }) => {
    setQueryParams(prev => ({ ...prev, pageNum: page, pageSize }))
    getList()
  }

  const reset = () => {
    form.resetFields()
    form.setFieldsValue({ status: '0', sex: '0' })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (values.userId) {
        await updateUser(values)
        message.success('修改成功')
      } else {
        await addUser(values)
        message.success('新增成功')
      }
      setOpen(false)
      getList()
    } catch {
      // validation error
    }
  }

  const handleNodeClick = (data) => {
    setDeptId(data.id)
    setQueryParams(prev => ({ ...prev, pageNum: 1 }))
    getList()
  }

  const columns = [
    { title: '用户编号', dataIndex: 'userId', key: 'userId', width: 80 },
    { title: '用户名称', dataIndex: 'userName', key: 'userName' },
    { title: '用户昵称', dataIndex: 'nickName', key: 'nickName' },
    { title: '部门', dataIndex: ['dept', 'deptName'], key: 'deptName' },
    { title: '手机号码', dataIndex: 'phonenumber', key: 'phonenumber', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status, record) => (
        <Switch
          checked={status === '0'}
          onChange={() => handleStatusChange(record)}
          disabled={record.userId === 1}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (text) => parseTime(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          {record.userId !== 1 && (
            <>
              <Button type="link" size="small" onClick={() => handleUpdate(record)}>修改</Button>
              <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record)}>
                <Button type="link" size="small" danger>删除</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      {showSearch && (
        <Form form={queryForm} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="userName" label="用户名称">
            <Input placeholder="请输入用户名称" onPressEnter={handleQuery} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="phonenumber" label="手机号码">
            <Input placeholder="请输入手机号码" onPressEnter={handleQuery} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="用户状态" allowClear style={{ width: 120 }}>
              <Select.Option value="0">正常</Select.Option>
              <Select.Option value="1">停用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="创建时间">
            <RangePicker value={dateRange} onChange={setDateRange} style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button>
              <Button onClick={resetQuery}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      )}

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增</Button>
        <Button type="primary" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleDelete({})}>删除</Button>
        <Button icon={<ImportOutlined />}>导入</Button>
        <Button icon={<ExportOutlined />}>导出</Button>
      </Space>

      <Table
        rowKey="userId"
        loading={loading}
        dataSource={userList}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }}
        pagination={false}
      />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />

      <Modal title={title} open={open} onOk={handleSubmit} onCancel={() => setOpen(false)} width={600} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="nickName" label="用户昵称" rules={[{ required: true, message: '请输入用户昵称' }]}>
            <Input placeholder="请输入用户昵称" />
          </Form.Item>
          <Form.Item name="deptId" label="归属部门" rules={[{ required: true, message: '请选择归属部门' }]}>
            <Select placeholder="请选择归属部门" options={deptOptions.map(d => ({ value: d.id, label: d.label }))} />
          </Form.Item>
          <Form.Item name="phonenumber" label="手机号码" rules={[{ pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号码' }]}>
            <Input placeholder="请输入手机号码" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="userName" label="用户名称" rules={[{ required: true, message: '请输入用户名称' }]}>
            <Input placeholder="请输入用户名称" />
          </Form.Item>
          <Form.Item name="password" label="用户密码">
            <Input.Password placeholder="请输入用户密码" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value="0">正常</Select.Option>
              <Select.Option value="1">停用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="roleIds" label="角色">
            <Select mode="multiple" placeholder="请选择角色" options={roleOptions.map(r => ({ value: r.roleId, label: r.roleName }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserPage
