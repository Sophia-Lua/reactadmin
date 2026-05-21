import React, { useState } from 'react'
import { Input, Space } from 'antd'

// In Vite, we can use import.meta.glob
const svgModules = import.meta.glob('@/assets/icons/svg/*.svg', { eager: true })
const iconNames = Object.keys(svgModules).map(path => path.match(/\/([^/]+)\.svg$/)?.[1]).filter(Boolean)

function IconSelect({ activeIcon, onSelect }) {
  const [search, setSearch] = useState('')
  const filteredIcons = iconNames.filter(name => name.includes(search))

  return (
    <div className="icon-body" style={{ padding: 10 }}>
      <Input.Search
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="请输入图标名称"
        style={{ marginBottom: 5 }}
        allowClear
      />
      <div className="icon-list" style={{ height: 200, overflow: 'auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filteredIcons.map((name, index) => (
            <div
              key={name}
              className={`icon-item-wrapper ${activeIcon === name ? 'active' : ''}`}
              onClick={() => onSelect && onSelect(name)}
              style={{
                width: 'calc(100% / 3)',
                cursor: 'pointer',
                padding: '0 5px',
                background: activeIcon === name ? '#ececec' : 'transparent',
                borderRadius: 5,
              }}
            >
              <svg className="icon" aria-hidden="true" style={{ width: 16, height: 16 }}>
                <use xlinkHref={`#icon-${name}`} />
              </svg>
              <span style={{ marginLeft: 4, fontSize: 12 }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default IconSelect
