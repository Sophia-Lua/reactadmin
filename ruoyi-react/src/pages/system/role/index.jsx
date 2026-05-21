import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Modal, Select, Switch, Popconfirm, message, Tree, Checkbox } from 'antd'
import { PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import { listRole, getRole, addRole, updateRole, delRole, changeRoleStatus, deptTreeSelect } from '@/api/system/role'
import { listMenu } from '@/api/system/menu'
import Pagination from '@/components/Pagination'
import { parseTime, addDateRange } from '@/utils/ruoyi'

function RolePage() {
  const [form] = Form.useForm()
  const [queryForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [roleList, setRoleList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, roleName: undefined, roleKey: undefined, status: undefined })
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [dateRange, setDateRange] = useState([])
  const [menuOptions, setMenuOptions] = useState([])
  const [deptOptions, setDeptOptions] = useState([])
  const [menuExpand, setMenuExpand] = useState(false)
  const [menuNodeAll, setMenuNodeAll] = useState(false)
  const [deptExpand, setDeptExpand] = useState(false)
  const [deptNodeAll, setDeptNodeAll] = useState(false)

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const params = addDateRange(queryParams, dateRange)
      const res = await listRole(params)
      setRoleList(res.rows || [])
      setTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const getMenuTreeselect = async () => {
    const res = await listMenu()
    setMenuOptions(res.data || [])
  }

  const getDeptTree = async () => {
    const res = await deptTreeSelect()
    setDeptOptions(res.data || [])
  }

  const handleQuery = () => {
    setQueryParams(prev => ({ ...prev, pageNum: 1 }))
    getList()
  }

  const resetQuery = () => {
    queryForm.resetFields()
    setDateRange([])
    handleQuery()
  }

  const handleAdd = () => {
    reset()
    setTitle('添加角色')
    setOpen(true)
  }

  const handleUpdate = async (record) => {
    reset()
    const roleId = record.roleId || selectedRowKeys[0]
    const res = await getRole(roleId)
    form.setFieldsValue(res.data)
    setTitle('修改角色')
    setOpen(true)
  }

  const handleDelete = async (record) => {
    const roleIds = record.roleId ? [record.roleId] : selectedRowKeys
    Modal.confirm({
      title: '确认删除',
      content: `是否确认删除角色编号为"${roleIds}"的数据项？`,
      onOk: async () => {
        await delRole(roleIds)
        message.success('删除成功')
        getList()
      },
    })
  }

  const handleStatusChange = async (record) => {
    try {
      await changeRoleStatus(record.roleId, record.status === '0' ? '1' : '0')
      message.success('修改成功')
      getList()
    } catch {
      // revert handled by table
    }
  }

  const handleSelectionChange = (keys) => setSelectedRowKeys(keys)

  const handlePageChange = ({ page, pageSize }) => {
    setQueryParams(prev => ({ ...prev, pageNum: page, pageSize }))
    getList()
  }

  const reset = () => form.resetFields()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (values.roleId) {
        await updateRole(values)
        message.success('修改成功')
      } else {
        await addRole(values)
        message.success('新增成功')
      }
      setOpen(false)
      getList()
    } catch {}
  }

  const columns = [
    { title: '角色编号', dataIndex: 'roleId', key: 'roleId', width: 80 },
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
    { title: '权限字符', dataIndex: 'roleKey', key: 'roleKey' },
    { title: '显示顺序', dataIndex: 'roleSort', key: 'roleSort', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status, record) => (
        <Switch checked={status === '0'} onChange={() => handleStatusChange(record)} />
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
          <Form.Item name="roleName" label="角色名称">
            <Input placeholder="请输入角色名称" onPressEnter={handleQuery} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="roleKey" label="权限字符">
            <Input placeholder="请输入权限字符" onPressEnter={handleQuery} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="角色状态" allowClear style={{ width: 120 }}>
              <Select.Option value="0">正常</Select.Option>
              <Select.Option value="1">停用</Select.Option>
            </Select>
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
      </Space>

      <Table
        rowKey="roleId"
        loading={loading}
        dataSource={roleList}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }}
        pagination={false}
      />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />

      <Modal title={title} open={open} onOk={handleSubmit} onCancel={() => setOpen(false)} width={600} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="roleName" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="roleKey" label="权限字符" rules={[{ required: true, message: '请输入权限字符' }]}>
            <Input placeholder="请输入权限字符" />
          </Form.Item>
          <Form.Item name="roleSort" label="显示顺序" rules={[{ required: true, message: '请输入显示顺序' }]}>
            <Input type="number" placeholder="请输入显示顺序" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value="0">正常</Select.Option>
              <Select.Option value="1">停用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="menuCheckStrictly" label="菜单权限">
            <Tree
              checkable
              treeData={menuOptions}
              fieldNames={{ title: 'menuName', key: 'menuId', children: 'children' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RolePage
