import React, { useState, useEffect } from 'react'
import { Descriptions, Button, Tag } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { getUser } from '@/api/system/user'
import { parseTime } from '@/utils/ruoyi'

function UserView() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    if (userId) {
      getUser(userId).then(res => setUserInfo(res.data))
    }
  }, [userId])

  return (
    <div style={{ padding: 20 }}>
      <h3>用户详情</h3>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="用户编号">{userInfo.userId}</Descriptions.Item>
        <Descriptions.Item label="登录名称">{userInfo.userName}</Descriptions.Item>
        <Descriptions.Item label="用户昵称">{userInfo.nickName}</Descriptions.Item>
        <Descriptions.Item label="用户邮箱">{userInfo.email}</Descriptions.Item>
        <Descriptions.Item label="手机号码">{userInfo.phonenumber}</Descriptions.Item>
        <Descriptions.Item label="用户性别">{userInfo.sex === '0' ? '男' : userInfo.sex === '1' ? '女' : '未知'}</Descriptions.Item>
        <Descriptions.Item label="所属部门">{userInfo.dept?.deptName}</Descriptions.Item>
        <Descriptions.Item label="所属岗位">{userInfo.posts?.map(p => p.postName).join(', ')}</Descriptions.Item>
        <Descriptions.Item label="所属角色">{userInfo.roles?.map(r => r.roleName).join(', ')}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={userInfo.status === '0' ? 'green' : 'red'}>
            {userInfo.status === '0' ? '正常' : '停用'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">{parseTime(userInfo.createTime)}</Descriptions.Item>
        <Descriptions.Item label="最后登录时间">{parseTime(userInfo.loginDate)}</Descriptions.Item>
        <Descriptions.Item label="创建者">{userInfo.createBy}</Descriptions.Item>
        <Descriptions.Item label="最后修改者">{userInfo.updateBy}</Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>{userInfo.remark}</Descriptions.Item>
      </Descriptions>
      <div style={{ marginTop: 16 }}>
        <Button onClick={() => navigate(-1)}>返回</Button>
      </div>
    </div>
  )
}

export default UserView
