import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, Popconfirm, message, DatePicker, Modal, Select } from 'antd'
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import { listOperLog, delOperLog, delOperLogAll, cleanOperLog } from '@/api/monitor/operlog'
import Pagination from '@/components/Pagination'
import { parseTime, addDateRange } from '@/utils/ruoyi'

const { RangePicker } = DatePicker

function OperLogPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(true)
  const [logList, setLogList] = useState([])
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [queryParams, setQueryParams] = useState({ pageNum: 1, pageSize: 10, title: undefined, operName: undefined, businessType: undefined, status: undefined })
  const [dateRange, setDateRange] = useState([])
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailData, setDetailData] = useState({})

  useEffect(() => { getList() }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const params = addDateRange(queryParams, dateRange)
      const res = await listOperLog(params)
      setLogList(res.rows || [])
      setTotal(res.total || 0)
    } finally { setLoading(false) }
  }

  const handleQuery = () => { setQueryParams(prev => ({ ...prev, pageNum: 1 })); getList() }
  const resetQuery = () => { form.resetFields(); setDateRange([]); handleQuery() }

  const handleDelete = async (record) => {
    const operIds = record.operId ? [record.operId] : selectedRowKeys
    Modal.confirm({
      title: '确认删除', content: '是否确认删除日志编号为"' + operIds + '"的数据项？',
      onOk: async () => { await delOperLog(operIds); message.success('删除成功'); getList() }
    })
  }

  const handleClean = async () => {
    Modal.confirm({
      title: '确认清空', content: '是否确认清空所有操作日志？',
      onOk: async () => { await cleanOperLog(); message.success('清空成功'); getList() }
    })
  }

  const handleSelectionChange = (keys) => setSelectedRowKeys(keys)
  const handlePageChange = ({ page, pageSize }) => { setQueryParams(prev => ({ ...prev, pageNum: page, pageSize })); getList() }

  const showDetail = (record) => {
    setDetailData(record)
    setDetailOpen(true)
  }

  const columns = [
    { title: '日志编号', dataIndex: 'operId', key: 'operId', width: 80 },
    { title: '系统模块', dataIndex: 'title', key: 'title' },
    { title: '操作类型', dataIndex: 'businessType', key: 'businessType', width: 100, render: (v) => {
      const types = ['其他', '新增', '修改', '删除', '授权', '导出', '导入', '强退', '生成代码', '清空数据']
      return types[v] || '其他'
    }},
    { title: '操作人员', dataIndex: 'operName', key: 'operName' },
    { title: '操作地址', dataIndex: 'operIp', key: 'operIp' },
    { title: '操作地点', dataIndex: 'operLocation', key: 'operLocation' },
    { title: '操作状态', dataIndex: 'status', key: 'status', width: 100, render: (v) => v === 0 ? '正常' : '失败' },
    { title: '操作日期', dataIndex: 'operTime', key: 'operTime', width: 160, render: (t) => parseTime(t) },
    {
      title: '操作', key: 'action', width: 100, render: (_, record) => (
        <Button type="link" size="small" onClick={() => showDetail(record)}>详细</Button>
      ),
    },
  ]

  return (
    <div>
      {showSearch && (
        <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="title" label="系统模块"><Input placeholder="请输入系统模块" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
          <Form.Item name="operName" label="操作人员"><Input placeholder="请输入操作人员" onPressEnter={handleQuery} style={{ width: 200 }} /></Form.Item>
          <Form.Item name="businessType" label="操作类型">
            <Select placeholder="操作类型" allowClear style={{ width: 120 }}>
              {[['其他', 0], ['新增', 1], ['修改', 2], ['删除', 3], ['授权', 4], ['导出', 5], ['导入', 6], ['强退', 7], ['生成代码', 8], ['清空数据', 9]].map(([label, value]) => (
                <Select.Option key={value} value={value}>{label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="状态" allowClear style={{ width: 100 }}>
              <Select.Option value={0}>成功</Select.Option><Select.Option value={1}>失败</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="操作时间"><RangePicker value={dateRange} onChange={setDateRange} style={{ width: 240 }} /></Form.Item>
          <Form.Item><Space><Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>搜索</Button><Button onClick={resetQuery}>重置</Button></Space></Form.Item>
        </Form>
      )}
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleDelete({})}>删除</Button>
        <Button danger onClick={handleClean}>清空</Button>
      </Space>
      <Table rowKey="operId" loading={loading} dataSource={logList} columns={columns} rowSelection={{ selectedRowKeys, onChange: handleSelectionChange }} pagination={false} scroll={{ x: 'max-content' }} />
      <Pagination total={total} page={queryParams.pageNum} pageSize={queryParams.pageSize} onPageChange={handlePageChange} />

      <Modal title="操作日志详细" open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null} width={700}>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr><td style={{ padding: 8, fontWeight: 'bold', width: 120 }}>操作模块：</td><td style={{ padding: 8 }}>{detailData.title} / {detailData.businessType}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>登录信息：</td><td style={{ padding: 8 }}>{detailData.operName} / {detailData.operIp} / {detailData.operLocation}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>请求地址：</td><td style={{ padding: 8 }}>{detailData.operUrl}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>请求方式：</td><td style={{ padding: 8 }}>{detailData.requestMethod}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>操作方法：</td><td style={{ padding: 8 }}>{detailData.method}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>请求参数：</td><td style={{ padding: 8 }}>{detailData.operParam}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>返回参数：</td><td style={{ padding: 8 }}>{detailData.jsonResult}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>操作状态：</td><td style={{ padding: 8 }}>{detailData.status === 0 ? '正常' : '失败'}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>错误消息：</td><td style={{ padding: 8 }}>{detailData.errorMsg}</td></tr>
            <tr><td style={{ padding: 8, fontWeight: 'bold' }}>操作日期：</td><td style={{ padding: 8 }}>{parseTime(detailData.operTime)}</td></tr>
          </tbody>
        </table>
      </Modal>
    </div>
  )
}

export default OperLogPage
