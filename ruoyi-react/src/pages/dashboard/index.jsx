import React from 'react'
import { Row, Col, Card, Button, Divider } from 'antd'
import { GithubOutlined, HomeOutlined } from '@ant-design/icons'

function Dashboard() {
  const version = '3.9.2'

  const goTarget = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div className="home" style={{ padding: 20 }}>
      <Row gutter={20}>
        <Col xs={24} lg={12} style={{ paddingLeft: 20 }}>
          <h2>若依后台管理框架</h2>
          <p>
            一直想做一款后台管理系统，看了很多优秀的开源项目但是发现没有合适自己的。于是利用空闲休息时间开始自己写一套后台系统。如此有了若依管理系统，她可以用于所有的Web应用程序，如网站管理后台，网站会员中心，CMS，CRM，OA等等，当然，您也可以对她进行深度定制，以做出更强系统。
          </p>
          <p>
            <b>当前版本:</b> <span>v{version}</span>
          </p>
          <p>
            <span style={{ background: '#f56c6c', color: '#fff', padding: '2px 8px', borderRadius: 3 }}>免费开源</span>
          </p>
          <p>
            <Button
              type="primary"
              icon={<GithubOutlined />}
              onClick={() => goTarget('https://gitee.com/y_project/RuoYi-Vue')}
              style={{ marginRight: 8 }}
            >
              访问码云
            </Button>
            <Button
              icon={<HomeOutlined />}
              onClick={() => goTarget('http://ruoyi.vip')}
            >
              访问主页
            </Button>
          </p>
        </Col>
        <Col xs={24} lg={12} style={{ paddingLeft: 50 }}>
          <h2>技术选型 (React 版)</h2>
          <Row gutter={16}>
            <Col span={12}>
              <h4>后端技术</h4>
              <ul>
                <li>SpringBoot</li>
                <li>Spring Security</li>
                <li>JWT</li>
                <li>MyBatis</li>
                <li>Druid</li>
              </ul>
            </Col>
            <Col span={12}>
              <h4>前端技术</h4>
              <ul>
                <li>React 18</li>
                <li>Redux Toolkit</li>
                <li>Ant Design 5</li>
                <li>Axios</li>
                <li>React Router v6</li>
              </ul>
            </Col>
          </Row>
        </Col>
      </Row>

      <Divider />

      <Row gutter={20}>
        <Col xs={24} md={12} lg={8}>
          <Card title="联系信息">
            <p>官网：http://www.ruoyi.vip</p>
            <p>版本：v{version}</p>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="更新日志">
            <p>3.9.2 - React 版本迁移</p>
            <p>3.9.1 - 优化用户体验</p>
            <p>3.9.0 - 新增功能</p>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="系统信息">
            <p>若依管理系统 React 版本</p>
            <p>基于 React 18 + Ant Design 5</p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
