import React from 'react'
import { Row, Col, Card, Button, Divider } from 'antd'
import { GithubOutlined, HomeOutlined } from '@ant-design/icons'

function Dashboard() {
  const version = '3.9.2'

  const goTarget = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div className="home" style={{ padding: 24 }}>
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Card
            hoverable
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: '1px solid #f0f0f0',
              background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
            }}
          >
            <div style={{ textAlign: 'center', padding: '0 40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>
                若依后台管理框架
              </h2>
              <p style={{ color: '#595959', lineHeight: 1.8, fontSize: '14px', marginBottom: 24 }}>
                一直想做一款后台管理系统，看了很多优秀的开源项目但是发现没有合适自己的。于是利用空闲休息时间开始自己写一套后台系统。如此有了若依管理系统，她可以用于所有的Web应用程序，如网站管理后台，网站会员中心，CMS，CRM，OA等等，当然，您也可以对她进行深度定制，以做出更强系统。
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: 24 }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#8c8c8c' }}>当前版本</span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #1e3c72 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  v{version}
                </span>
                <span style={{
                  background: 'linear-gradient(135deg, #f5222d 0%, #fa541c 100%)',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(245, 34, 45, 0.3)',
                }}>
                  免费开源
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <Button
                  type="primary"
                  icon={<GithubOutlined />}
                  onClick={() => goTarget('https://gitee.com/y_project/RuoYi-Vue')}
                  style={{
                    borderRadius: '24px',
                    padding: '0 24px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  访问码云
                </Button>
                <Button
                  icon={<HomeOutlined />}
                  onClick={() => goTarget('http://ruoyi.vip')}
                  style={{
                    borderRadius: '24px',
                    padding: '0 24px',
                    height: '40px',
                    border: '1px solid #d9d9d9',
                    transition: 'all 0.3s ease',
                  }}
                >
                  访问主页
                </Button>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            hoverable
            title={<h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>技术选型 (React 版)</h3>}
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: '1px solid #f0f0f0',
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#262626', marginBottom: 12, borderBottom: '2px solid #1890ff', paddingBottom: 8 }}>
                  后端技术
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, color: '#595959', lineHeight: 2 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1890ff' }} />SpringBoot</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1890ff' }} />Spring Security</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1890ff' }} />JWT</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1890ff' }} />MyBatis</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1890ff' }} />Druid</li>
                </ul>
              </Col>
              <Col span={12}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#262626', marginBottom: 12, borderBottom: '2px solid #52c41a', paddingBottom: 8 }}>
                  前端技术
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, color: '#595959', lineHeight: 2 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#52c41a' }} />React 18</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#52c41a' }} />Redux Toolkit</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#52c41a' }} />Ant Design 5</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#52c41a' }} />Axios</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#52c41a' }} />React Router v6</li>
                </ul>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Divider style={{ margin: '24px 0' }} />

      <Row gutter={[20, 20]}>
        <Col xs={24} md={12} lg={8}>
          <Card
            hoverable
            title={<h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>联系信息</h3>}
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: '1px solid #f0f0f0',
            }}
          >
            <p style={{ marginBottom: 8, color: '#595959' }}>
              <strong style={{ color: '#262626' }}>官网：</strong><a href="http://www.ruoyi.vip">http://www.ruoyi.vip</a>
            </p>
            <p style={{ marginBottom: 0, color: '#595959' }}>
              <strong style={{ color: '#262626' }}>版本：</strong>v{version}
            </p>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card
            hoverable
            title={<h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>更新日志</h3>}
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: '1px solid #f0f0f0',
            }}
          >
            <p style={{ marginBottom: 8, color: '#595959' }}>3.9.2 - React 版本迁移</p>
            <p style={{ marginBottom: 8, color: '#595959' }}>3.9.1 - 优化用户体验</p>
            <p style={{ marginBottom: 0, color: '#595959' }}>3.9.0 - 新增功能</p>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card
            hoverable
            title={<h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>系统信息</h3>}
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: '1px solid #f0f0f0',
            }}
          >
            <p style={{ marginBottom: 8, color: '#595959' }}>若依管理系统 React 版本</p>
            <p style={{ marginBottom: 0, color: '#595959' }}>基于 React 18 + Ant Design 5</p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
