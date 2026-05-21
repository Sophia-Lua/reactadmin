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
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            position: 'fixed',
            top: 0,
            right: 0,
            left: isMobile ? 0 : (collapsed ? 64 : 210),
            zIndex: 9,
            height: 56,
            lineHeight: '56px',
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Navbar onToggle={handleToggle} />
        </Header>
        {showTagsView && <TagsView />}
        <Content
          style={{
            marginTop: showTagsView ? (fixedHeader ? 96 : 96) : (fixedHeader ? 56 : 56),
            minHeight: 280,
            padding: '24px',
            background: '#f5f7fa',
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
