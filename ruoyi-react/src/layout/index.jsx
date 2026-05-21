import React, { useState, useEffect } from 'react'
import { Layout } from 'antd'
import Sidebar from './components/Sidebar'
import AppMain from './components/AppMain'
import Navbar from './components/Navbar'
import TagsView from './components/TagsView'
import Settings from './components/Settings'
import { useSelector, useDispatch } from 'react-redux'
import { toggleSidebar } from '@/store/slices/appSlice'
import '@/assets/styles/sidebar.scss'

const { Sider, Content, Header } = Layout

function DefaultLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const device = useSelector(state => state.app.device)
  const showSettings = useSelector(state => state.settings.showSettings)
  const showTagsView = useSelector(state => state.settings.tagsView)
  const fixedHeader = useSelector(state => state.settings.fixedHeader)
  const sidebarLogo = useSelector(state => state.settings.sidebarLogo)
  const dispatch = useDispatch()

  const isMobile = device === 'mobile'

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile])

  const handleToggle = () => {
    if (!isMobile) {
      setCollapsed(!collapsed)
    } else {
      dispatch(toggleSidebar())
    }
  }

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      {(isMobile ? true : !collapsed) && (
        <Sidebar
          collapsed={isMobile ? true : collapsed}
          isMobile={isMobile}
          onToggle={handleToggle}
          showLogo={sidebarLogo}
        />
      )}
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#fff',
            position: 'fixed',
            top: 0,
            right: 0,
            left: isMobile ? 0 : (collapsed ? 54 : 210),
            zIndex: 9,
            height: 50,
            lineHeight: '50px',
            transition: 'left 0.2s',
          }}
        >
          <Navbar onToggle={handleToggle} />
        </Header>
        {showTagsView && <TagsView />}
        <Content
          style={{
            marginTop: showTagsView ? (fixedHeader ? 84 : 84) : (fixedHeader ? 50 : 50),
            minHeight: 280,
            padding: '20px',
            background: '#f0f2f5',
          }}
        >
          <AppMain />
        </Content>
      </Layout>
      {showSettings && <Settings />}
    </Layout>
  )
}

export default DefaultLayout
