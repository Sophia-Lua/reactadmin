import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Modal, Select, TreeSelect, Popconfirm, message, Radio } from 'antd'
import { PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import { listMenu, getMenu, addMenu, updateMenu, delMenu, treeselect, roleMenuTreeselect } from '@/api/system/menu'
import { handleTree } from '@/utils/ruoyi'

function MenuPage() {
  const [form] = Form.useForm()
  const [queryForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [menuList, setMenuList] = useState([])
  const [queryParams, setQueryParams] = useState({ menuName: undefined, status: undefined })
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [menuOptions, setMenuOptions] = useState([])
  const [iconOpen, setIconOpen] = useState(false)

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const res = await listMenu(queryParams)
      setMenuList(handleTree(res.data || [], 'menuId'))
    } finally {
      setLoading(false)
    }
  }

  const getTreeselect = async () => {
    const res = await treeselect()
    setMenuOptions(res.data || [])
  }

  const handleQuery = () => getList()

  const resetQuery = () => {
    queryForm.resetFields()
    getList()
  }

  const handleAdd = (record) => {
    reset()
    getTreeselect()
    if (record) {
      form.setFieldsValue({ parentId: record.menuId })
    }
    setTitle('添加菜单')
    setOpen(true)
  }

  const handleUpdate = async (record) => {
    reset()
    getTreeselect()
    const res = await getMenu(record.menuId)
    form.setFieldsValue(res.data)
    setTitle('修改菜单')
    setOpen(true)
  }

  const handleDelete = async (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `是否确认删除名称为"${record.menuName}"的数据项？`,
      onOk: async () => {
        await delMenu(record.menuId)
        message.success('删除成功')
        getList()
      },
    })
  }

  const handleSelectionChange = (keys) => {}

  const reset = () => form.resetFields()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (values.menuId) {
        await updateMenu(values)
        message.success('修改成功')
      } else {
        await addMenu(values)
        message.success('新增成功')
      }
      setOpen(false)
      getList()
    } catch {}
  }

  const columns = [
    { title: '菜单名称', dataIndex: 'menuName', key: 'menuName', width: 200 },
    { title: '图标', dataIndex: 'icon', key: 'icon', width: 60 },
    { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 60 },
    { title: '权限标识', dataIndex: 'perms', key: 'perms' },
    { title: '组件路径', dataIndex: 'component', key: 'component' },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (v) => v === '0' ? '正常' : '停用' },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleUpdate(record)}>修改</Button>
          <Button type="link" size="small" onClick={() => handleAdd(record)}>新增</Button>
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
        <Form.Item name="menuName" label="菜单名称">
          <Input placeholder="请输入菜单名称" onPressEnter={handleQuery} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select placeholder="状态" allowClear style={{ width: 120 }}>
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

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>新增</Button>
      </Space>

      <Table
        rowKey="menuId"
        loading={loading}
        dataSource={menuList}
        columns={columns}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />

      <Modal title={title} open={open} onOk={handleSubmit} onCancel={() => setOpen(false)} width={680} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="parentId" label="上级菜单">
            <TreeSelect
              treeData={menuOptions}
              fieldNames={{ label: 'menuName', value: 'menuId', children: 'children' }}
              placeholder="请选择上级菜单"
            />
          </Form.Item>
          <Form.Item name="menuType" label="菜单类型">
            <Radio.Group>
              <Radio value="M">目录</Radio>
              <Radio value="C">菜单</Radio>
              <Radio value="F">按钮</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="icon" label="菜单图标">
            <Input placeholder="请输入菜单图标" />
          </Form.Item>
          <Form.Item name="menuName" label="菜单名称" rules={[{ required: true, message: '请输入菜单名称' }]}>
            <Input placeholder="请输入菜单名称" />
          </Form.Item>
          <Form.Item name="orderNum" label="显示排序" rules={[{ required: true, message: '请输入显示排序' }]}>
            <Input type="number" placeholder="请输入显示排序" />
          </Form.Item>
          <Form.Item name="isFrame" label="是否外链">
            <Radio.Group>
              <Radio value="0">是</Radio>
              <Radio value="1">否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="path" label="路由地址">
            <Input placeholder="请输入路由地址" />
          </Form.Item>
          <Form.Item name="component" label="组件路径">
            <Input placeholder="请输入组件路径" />
          </Form.Item>
          <Form.Item name="perms" label="权限字符">
            <Input placeholder="请输入权限字符" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value="0">正常</Select.Option>
              <Select.Option value="1">停用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default MenuPage
