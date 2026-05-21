import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, message, Modal } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { unallocatedUserList, authUserSelectAll } from '@/api/system/role'
import Pagination from '@/components/Pagination'

function SelectUser({ roleId, open, onClose, onSuccess }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [userList, setUserList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, userName: undefined, phonenumber: undefined, roleId })

  useEffect(() => {
    if (open) {
      getList()
    }
  }, [open])

  const getList = async () => {
    setLoading(true)
    try {
      const res = await unallocatedUserList({ ...queryParams, roleId })
      setUserList(res.rows || [])
      setTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const handleQuery = () => { setQueryParams(prev => ({ ...prev, pageNum: 1 })); getList() }
  const resetQuery = () => { form.resetFields(); handleQuery() }
  const handlePageChange = ({ page, pageSize }) => { setQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getList() }

  const handleSelect = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择用户')
      return
    }
    await authUserSelectAll({ roleId, userIds: selectedRowKeys.join(',') })
    message.success('授权成功')
    setSelectedRowKeys([])
    onSuccess?.()
  }

  const columns = [
    { title: '用户名称', dataIndex: 'userName', key: 'userName' },
    { title: '手机', dataIndex: 'phonenumber', key: 'phonenumber' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (v) => v === '0' ? '正常' : '停用' },
  ]

  return (
    <Modal title="选择用户" open={open} onCancel={onClose} footer={null} width={800}>
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="userName" label="用户名称"><Input placeholder="请输入用户名称" onPressEnter={handleQuery} style={{ width: 180 }} /></Form.Item>
        <Form.Item name="phonenumber" label="手机号码"><Input placeholder="请输入手机号码" onPressEnter={handleQuery} style={{ width: 180 }} /></Form.Item>
        <Form.Item><Space><Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
      </Form>
      <Table
        rowKey="userId"
        loading={loading}
        dataSource={userList}
        columns={columns}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        pagination={false}
      />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleSelect}>确定</Button>
        </Space>
      </div>
    </Modal>
  )
}

export default SelectUser
