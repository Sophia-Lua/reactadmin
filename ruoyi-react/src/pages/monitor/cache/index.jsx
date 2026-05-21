import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Table, Descriptions, Popconfirm, Button, message, Tabs, Space } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { getCache, listCacheName, getCacheKeys, getCacheValue, clearCacheName, clearCacheKey, clearCacheAll } from '@/api/monitor/cache'

function CachePage() {
  const [cache, setCache] = useState({})
  const [cacheNames, setCacheNames] = useState([])
  const [cacheKeys, setCacheKeys] = useState([])
  const [cacheValue, setCacheValue] = useState({})
  const [activeTab, setActiveTab] = useState('1')
  const [loading, setLoading] = useState(false)
  const [selectedCacheName, setSelectedCacheName] = useState('')
  const [selectedCacheKey, setSelectedCacheKey] = useState('')

  useEffect(() => {
    getInfo()
  }, [])

  const getInfo = async () => {
    setLoading(true)
    try {
      const res = await getCache()
      setCache(res.data || res)
    } finally { setLoading(false) }
  }

  const getCacheNames = async () => {
    setLoading(true)
    try {
      const res = await listCacheName()
      setCacheNames(res.data || [])
    } finally { setLoading(false) }
  }

  const getCacheKeys = async (cacheName) => {
    setSelectedCacheName(cacheName)
    setLoading(true)
    try {
      const res = await getCacheKeys(cacheName)
      setCacheKeys(res.data || [])
    } finally { setLoading(false) }
  }

  const getCacheValueDetail = async (cacheName, cacheKey) => {
    setSelectedCacheKey(cacheKey)
    setLoading(true)
    try {
      const res = await getCacheValue(cacheName, cacheKey)
      setCacheValue(res.data || res)
    } finally { setLoading(false) }
  }

  const handleClearCacheName = async (cacheName) => {
    await clearCacheName(cacheName)
    message.success('清空成功')
    getInfo()
  }

  const handleClearCacheKey = async (cacheName, cacheKey) => {
    await clearCacheKey(cacheName, cacheKey)
    message.success('删除成功')
    getCacheKeys(cacheName)
  }

  const handleClearAll = async () => {
    await clearCacheAll()
    message.success('清空成功')
    getInfo()
  }

  const infoData = cache.info ? Object.entries(cache.info).map(([key, value]) => ({ key, value })) : []
  const commandStats = cache.commandStats || []
  const dbSize = cache.dbSize || 0

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="基本信息" extra={<Button onClick={getInfo}>刷新</Button>}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Redis版本">{cache.redisVersion}</Descriptions.Item>
              <Descriptions.Item label="运行模式">{cache.redisMode === 'standalone' ? '单机' : '集群'}</Descriptions.Item>
              <Descriptions.Item label="端口">{cache.port}</Descriptions.Item>
              <Descriptions.Item label="客户端数">{cache.connectedClients}</Descriptions.Item>
              <Descriptions.Item label="运行天数">{cache.uptimeInDays}</Descriptions.Item>
              <Descriptions.Item label="Key数量">{dbSize}</Descriptions.Item>
              <Descriptions.Item label="使用内存">{cache.usedMemoryHuman}</Descriptions.Item>
              <Descriptions.Item label="使用CPU">{(cache.usedCpuSys || 0).toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="内存配置">{cache.maxmemoryHuman || '无限制'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="命令统计">
            <Table
              dataSource={commandStats.map((item, i) => ({ key: i, name: item.name, value: item.value }))}
              columns={[{ title: '命令', dataIndex: 'name' }, { title: '执行次数', dataIndex: 'value' }]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Card title="缓存监控" style={{ marginTop: 16 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="缓存列表" key="1">
            <Table
              loading={loading}
              dataSource={cacheNames.map(name => ({ key: name, cacheName: name }))}
              columns={[
                { title: '缓存名称', dataIndex: 'cacheName' },
                {
                  title: '操作', key: 'action', width: 200, render: (_, record) => (
                    <Space>
                      <Button type="link" size="small" onClick={() => getCacheKeys(record.cacheName)}>键列表</Button>
                      <Popconfirm title="确认清空？" onConfirm={() => handleClearCacheName(record.cacheName)}>
                        <Button type="link" size="small" danger>清空</Button>
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
              rowKey="key"
              pagination={false}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="键列表" key="2">
            <Table
              loading={loading}
              dataSource={cacheKeys.map(key => ({ key, cacheKey: key }))}
              columns={[
                { title: '缓存键名', dataIndex: 'cacheKey' },
                {
                  title: '操作', key: 'action', width: 200, render: (_, record) => (
                    <Space>
                      <Button type="link" size="small" onClick={() => getCacheValueDetail(selectedCacheName, record.cacheKey)}>值</Button>
                      <Popconfirm title="确认删除？" onConfirm={() => handleClearCacheKey(selectedCacheName, record.cacheKey)}>
                        <Button type="link" size="small" danger>删除</Button>
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
              rowKey="key"
              pagination={false}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="缓存值" key="3">
            <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, maxHeight: 400, overflow: 'auto' }}>
              {JSON.stringify(cacheValue, null, 2)}
            </pre>
          </Tabs.TabPane>
        </Tabs>
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Popconfirm title="确认清空所有缓存？" onConfirm={handleClearAll}>
            <Button danger icon={<DeleteOutlined />}>清空全部</Button>
          </Popconfirm>
        </div>
      </Card>
    </div>
  )
}

export default CachePage
