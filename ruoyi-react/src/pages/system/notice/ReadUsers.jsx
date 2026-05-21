import React, { useState, useEffect } from 'react'
import { Table, Button } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { getNoticeReadUsers } from '@/api/system/notice'
import { parseTime } from '@/utils/ruoyi'

function ReadUsers() {
  const { noticeId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (noticeId) {
      setLoading(true)
      getNoticeReadUsers(noticeId)
        .then(res => setUsers(res.data || []))
        .finally(() => setLoading(false))
    }
  }, [noticeId])

  const columns = [
    { title: '用户名称', dataIndex: 'userName', key: 'userName' },
    { title: '用户昵称', dataIndex: 'nickName', key: 'nickName' },
    { title: '阅读时间', dataIndex: 'readTime', key: 'readTime', render: (t) => parseTime(t) },
  ]

  return (
    <div style={{ padding: 20 }}>
      <h3>已读用户列表</h3>
      <Table
        rowKey="userId"
        loading={loading}
        dataSource={users}
        columns={columns}
        pagination={false}
      />
      <div style={{ marginTop: 16 }}>
        <Button onClick={() => navigate(-1)}>返回</Button>
      </div>
    </div>
  )
}

export default ReadUsers
