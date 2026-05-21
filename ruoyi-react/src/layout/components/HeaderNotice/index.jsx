import React from 'react'
import { Badge, Popover, List, Button } from 'antd'
import { BellOutlined } from '@ant-design/icons'

function HeaderNotice() {
  const [notifications, setNotifications] = React.useState([
    { id: 1, title: '系统通知', content: '系统已升级到最新版本', time: '2024-01-01' },
  ])

  const content = (
    <div style={{ width: 300 }}>
      <List
        size="small"
        dataSource={notifications}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              description={
                <>
                  <div>{item.content}</div>
                  <div style={{ color: '#999', fontSize: 12 }}>{item.time}</div>
                </>
              }
            />
          </List.Item>
        )}
        footer={<Button type="link" block>查看全部</Button>}
      />
    </div>
  )

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <div style={{ padding: '0 12px', cursor: 'pointer' }}>
        <Badge count={notifications.length}>
          <BellOutlined />
        </Badge>
      </div>
    </Popover>
  )
}

export default HeaderNotice
