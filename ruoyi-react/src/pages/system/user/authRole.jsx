import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Table, Space, List, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { getAuthRole, updateAuthRole } from '@/api/system/user'
import { listRole } from '@/api/system/role'

function AuthRole() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [roles, setRoles] = useState([])
  const [selectedRoleIds, setSelectedRoleIds] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAuthRoles()
  }, [userId])

  const getAuthRoles = async () => {
    setLoading(true)
    try {
      const res = await getAuthRole(userId)
      setUser(res.user)
      setRoles(res.roles)
      setSelectedRoleIds(res.roles.filter(r => r.flag).map(r => r.roleId))
    } finally { setLoading(false) }
  }

  const handleSubmit = async () => {
    await updateAuthRole({ userId, roleIds: selectedRoleIds.join(',') })
    message.success('授权成功')
    navigate(-1)
  }

  return (
    <div>
      <h3>用户: {user.userName}</h3>
      <List
        loading={loading}
        dataSource={roles}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta title={item.roleName} description={item.roleKey} />
            <input
              type="checkbox"
              checked={selectedRoleIds.includes(item.roleId)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRoleIds([...selectedRoleIds, item.roleId])
                } else {
                  setSelectedRoleIds(selectedRoleIds.filter(id => id !== item.roleId))
                }
              }}
            />
          </List.Item>
        )}
      />
      <Space style={{ marginTop: 16 }}>
        <Button type="primary" onClick={handleSubmit}>提交</Button>
        <Button onClick={() => navigate(-1)}>返回</Button>
      </Space>
    </div>
  )
}

export default AuthRole
