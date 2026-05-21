import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Drawer, Switch, Divider } from 'antd'
import { changeSetting, toggleSettings } from '@/store/slices/settingsSlice'

function Settings() {
  const dispatch = useDispatch()
  const showSettings = useSelector(state => state.settings.showSettings)
  const showTagsView = useSelector(state => state.settings.tagsView)
  const showFixedHeader = useSelector(state => state.settings.fixedHeader)
  const showSidebarLogo = useSelector(state => state.settings.sidebarLogo)
  const dynamicTitle = useSelector(state => state.settings.dynamicTitle)

  const handleChange = (key, value) => {
    dispatch(changeSetting({ key, value }))
  }

  return (
    <Drawer
      title="系统布局配置"
      open={showSettings}
      onClose={() => dispatch(toggleSettings())}
      width={320}
    >
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>整体风格设置</div>
      <Divider />

      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}>开启 Tags-View</div>
        <Switch checked={showTagsView} onChange={(v) => handleChange('tagsView', v)} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}>固定 Header</div>
        <Switch checked={showFixedHeader} onChange={(v) => handleChange('fixedHeader', v)} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}>侧边栏 Logo</div>
        <Switch checked={showSidebarLogo} onChange={(v) => handleChange('sidebarLogo', v)} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}>动态标题</div>
        <Switch checked={dynamicTitle} onChange={(v) => handleChange('dynamicTitle', v)} />
      </div>
    </Drawer>
  )
}

export default Settings
