import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Progress, Table, Tag, Spin } from 'antd'
import { getServer } from '@/api/monitor/server'

function ServerPage() {
  const [server, setServer] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => { getList() }, [])

  const getList = async () => {
    setLoading(true)
    try {
      const res = await getServer()
      setServer(res.data || res)
    } finally { setLoading(false) }
  }

  const cpuColumns = [
    { title: '属性', dataIndex: 'name', key: 'name' },
    { title: '值', dataIndex: 'value', key: 'value' },
  ]

  const memColumns = [
    { title: '属性', dataIndex: 'name', key: 'name' },
    { title: '内存', dataIndex: 'value', key: 'value' },
  ]

  const diskColumns = [
    { title: '盘符路径', dataIndex: 'dirName', key: 'dirName' },
    { title: '文件系统', dataIndex: 'sysTypeName', key: 'sysTypeName' },
    { title: '盘符类型', dataIndex: 'typeName', key: 'typeName' },
    { title: '总大小', dataIndex: 'total', key: 'total' },
    { title: '可用大小', dataIndex: 'free', key: 'free' },
    { title: '已用大小', dataIndex: 'used', key: 'used' },
    { title: '已用百分比', dataIndex: 'usage', key: 'usage', render: (v) => <Tag color={parseFloat(v) > 80 ? 'red' : 'green'}>{v}</Tag> },
  ]

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />

  const cpu = server.cpu || {}
  const mem = server.mem || {}
  const jvm = server.jvm || {}
  const sys = server.sys || {}
  const sysFiles = server.sysFiles || []

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="CPU">
            <Table
              dataSource={[
                { name: '核心数', value: cpu.cpuNum },
                { name: '用户使用率', value: cpu.used },
                { name: '系统使用率', value: cpu.sys },
                { name: '当前空闲率', value: cpu.free },
              ]}
              columns={cpuColumns}
              pagination={false}
              size="small"
            />
            <div style={{ marginTop: 16 }}>
              <span>CPU使用率: </span>
              <Progress percent={parseFloat(cpu.used) || 0} status={parseFloat(cpu.used) > 80 ? 'exception' : 'normal'} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="内存">
            <Table
              dataSource={[
                { name: '总内存', value: mem.total },
                { name: '已用内存', value: mem.used },
                { name: '剩余内存', value: mem.free },
                { name: '使用率', value: mem.usage },
              ]}
              columns={memColumns}
              pagination={false}
              size="small"
            />
            <div style={{ marginTop: 16 }}>
              <span>内存使用率: </span>
              <Progress percent={parseFloat(mem.usage) || 0} status={parseFloat(mem.usage) > 80 ? 'exception' : 'normal'} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="服务器信息">
            <Table
              dataSource={[
                { name: '服务器名称', value: sys.computerName },
                { name: '服务器IP', value: sys.computerIp },
                { name: '操作系统', value: sys.osName },
                { name: '系统架构', value: sys.osArch },
              ]}
              columns={cpuColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Java虚拟机信息">
            <Table
              dataSource={[
                { name: 'Java版本', value: jvm.version },
                { name: '启动时间', value: jvm.startTime },
                { name: '运行时长', value: jvm.runTime },
                { name: '安装路径', value: jvm.home },
              ]}
              columns={cpuColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Card title="磁盘状态" style={{ marginTop: 16 }}>
        <Table dataSource={sysFiles} columns={diskColumns} rowKey="dirName" pagination={false} />
      </Card>
    </div>
  )
}

export default ServerPage
