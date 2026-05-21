import React, { useState, useEffect } from 'react'
import { Descriptions, Button, Card, Table, Tag } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { getDictType } from '@/api/system/dict/type'
import { listDictData } from '@/api/system/dict/data'
import { parseTime } from '@/utils/ruoyi'

function DictDetail() {
  const { dictId } = useParams()
  const navigate = useNavigate()
  const [dictInfo, setDictInfo] = useState({})
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (dictId) {
      getDictType(dictId).then(res => setDictInfo(res.data))
      listDictData({ pageNum: 1, pageSize: 100 }).then(res => {
        setDataList(res.rows || [])
      })
    }
  }, [dictId])

  const columns = [
    { title: '字典标签', dataIndex: 'dictLabel', key: 'dictLabel' },
    { title: '字典键值', dataIndex: 'dictValue', key: 'dictValue' },
    { title: '排序', dataIndex: 'dictSort', key: 'dictSort', width: 80 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (v) => v === '0' ? '正常' : '停用' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
  ]

  return (
    <div style={{ padding: 20 }}>
      <h3>字典详情</h3>
      <Card style={{ marginBottom: 16 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="字典编号">{dictInfo.dictId}</Descriptions.Item>
          <Descriptions.Item label="字典名称">{dictInfo.dictName}</Descriptions.Item>
          <Descriptions.Item label="字典类型">{dictInfo.dictType}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={dictInfo.status === '0' ? 'green' : 'red'}>
              {dictInfo.status === '0' ? '正常' : '停用'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">{parseTime(dictInfo.createTime)}</Descriptions.Item>
          <Descriptions.Item label="备注">{dictInfo.remark}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="字典数据">
        <Table
          rowKey="dictCode"
          loading={loading}
          dataSource={dataList}
          columns={columns}
          pagination={false}
        />
      </Card>
      <div style={{ marginTop: 16 }}>
        <Button onClick={() => navigate(-1)}>返回</Button>
      </div>
    </div>
  )
}

export default DictDetail
