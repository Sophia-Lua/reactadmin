import React, { useState } from 'react'
import { Modal, Input, Space } from 'antd'
import * as Icons from '@ant-design/icons'

function IconsDialog({ open, onClose, onSelect }) {
  const [searchText, setSearchText] = useState('')

  const iconList = Object.keys(Icons)
    .filter(name => name.endsWith('Outlined') || name.endsWith('Filled') || name.endsWith('TwoTone'))
    .filter(name => name.toLowerCase().includes(searchText.toLowerCase()))

  return (
    <Modal title="选择图标" open={open} onCancel={onClose} footer={null} width={600}>
      <Input
        placeholder="搜索图标"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <div style={{ maxHeight: 400, overflow: 'auto' }}>
        <Space wrap>
          {iconList.slice(0, 100).map(name => {
            const IconComponent = Icons[name]
            return (
              <div
                key={name}
                style={{
                  width: 80, height: 80, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  border: '1px solid #d9d9d9', borderRadius: 4,
                }}
                onClick={() => { onSelect?.(name); onClose() }}
              >
                <IconComponent style={{ fontSize: 24 }} />
                <span style={{ fontSize: 12, marginTop: 4, wordBreak: 'break-all' }}>{name}</span>
              </div>
            )
          })}
        </Space>
      </div>
    </Modal>
  )
}

export default IconsDialog
