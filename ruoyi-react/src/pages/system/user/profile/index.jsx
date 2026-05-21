import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Tabs, Descriptions, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { getUserProfile } from '@/api/system/user'
import UserInfo from './userInfo'
import ResetPwd from './resetPwd'
import UserAvatar from './userAvatar'

function ProfilePage() {
  const [userInfo, setUserInfo] = useState({})
  const [roleGroup, setRoleGroup] = useState('')
  const [postGroup, setPostGroup] = useState('')

  useEffect(() => { getUser() }, [])

  const getUser = async () => {
    const res = await getUserProfile()
    setUserInfo(res.data || res.user)
    setRoleGroup(res.roleGroup || '')
    setPostGroup(res.postGroup || '')
  }

  const items = [
    { key: 'basic', label: '基本资料', children: <UserInfo userInfo={userInfo} onUpdate={getUser} /> },
    { key: 'pwd', label: '修改密码', children: <ResetPwd /> },
  ]

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={8}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <UserAvatar avatar={userInfo.avatar} onChange={(url) => setUserInfo(prev => ({ ...prev, avatar: url }))} />
            <h3 style={{ marginTop: 16 }}>{userInfo.userName}</h3>
            <Descriptions column={1} size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="手机号码">{userInfo.phonenumber}</Descriptions.Item>
              <Descriptions.Item label="用户邮箱">{userInfo.email}</Descriptions.Item>
              <Descriptions.Item label="所属角色">{roleGroup}</Descriptions.Item>
              <Descriptions.Item label="所属岗位">{postGroup}</Descriptions.Item>
            </Descriptions>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={16}>
        <Card>
          <Tabs items={items} />
        </Card>
      </Col>
    </Row>
  )
}

export default ProfilePage
