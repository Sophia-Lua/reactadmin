import React from 'react'
import { Row, Col, Card, Statistic } from 'antd'
import { TeamOutlined, MessageOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons'

function PanelGroup({ onSetLineChartData }) {
  const panels = [
    { title: '访客', value: 102400, icon: <TeamOutlined />, color: '#40c9c6', type: 'newVisitis' },
    { title: '消息', value: 81212, icon: <MessageOutlined />, color: '#36a3f7', type: 'messages' },
    { title: '金额', value: 9280, icon: <DollarOutlined />, color: '#f4516c', type: 'purchases' },
    { title: '订单', value: 13600, icon: <ShoppingCartOutlined />, color: '#34bfa3', type: 'shoppings' },
  ]

  return (
    <Row gutter={40} className="panel-group" style={{ marginTop: 18 }}>
      {panels.map(panel => (
        <Col xs={12} sm={12} lg={6} key={panel.type} style={{ marginBottom: 32 }}>
          <Card
            hoverable
            onClick={() => onSetLineChartData?.(panel.type)}
            style={{ cursor: 'pointer' }}
            bodyStyle={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: panel.color, display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginRight: 16,
              }}>
                <span style={{ fontSize: 28, color: '#fff' }}>{panel.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: 14, color: '#999', marginBottom: 4 }}>{panel.title}</div>
                <Statistic value={panel.value} precision={0} valueStyle={{ fontSize: 24 }} />
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default PanelGroup
