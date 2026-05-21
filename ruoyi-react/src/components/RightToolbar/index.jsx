import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Button, Tooltip, Dropdown, Modal, Transfer, Checkbox, Space } from 'antd'
import { SearchOutlined, ReloadOutlined, MenuOutlined, CheckOutlined } from '@ant-design/icons'
import cache from '@/plugins/cache'

function RightToolbar({ showSearch, onShowSearchChange, onQuery, columns = [], search = true, showColumnsType = 'checkbox', gutter, storageKey, onColumnsChange }) {
  const [open, setOpen] = useState(false)
  const isChecked = useMemo(() => {
    const arr = Array.isArray(columns) ? columns : Object.values(columns)
    return arr.every(col => col.visible)
  }, [columns])

  const isIndeterminate = useMemo(() => {
    const arr = Array.isArray(columns) ? columns : Object.values(columns)
    return arr.some(col => col.visible) && !isChecked
  }, [columns, isChecked])

  useEffect(() => {
    if (storageKey) {
      try {
        const saved = cache.local.getJSON(storageKey)
        if (saved && typeof saved === 'object') {
          if (Array.isArray(columns)) {
            columns.forEach((col, index) => {
              if (saved[index] !== undefined) col.visible = saved[index]
            })
          } else {
            Object.keys(columns).forEach(key => {
              if (saved[key] !== undefined) columns[key].visible = saved[key]
            })
          }
          onColumnsChange && onColumnsChange(columns)
        }
      } catch (e) {}
    }
  }, [storageKey])

  const toggleSearch = useCallback(() => {
    onShowSearchChange && onShowSearchChange(!showSearch)
  }, [showSearch, onShowSearchChange])

  const refresh = useCallback(() => {
    onQuery && onQuery()
  }, [onQuery])

  const showColumn = useCallback(() => {
    setOpen(true)
  }, [])

  const saveStorage = useCallback((cols) => {
    if (!storageKey) return
    try {
      let state = {}
      if (Array.isArray(cols)) {
        cols.forEach((col, index) => { state[index] = col.visible })
      } else {
        Object.keys(cols).forEach(key => { state[key] = cols[key].visible })
      }
      cache.local.setJSON(storageKey, state)
    } catch (e) {}
  }, [storageKey])

  const checkboxChange = useCallback((e, key) => {
    const cols = Array.isArray(columns) ? [...columns] : { ...columns }
    if (Array.isArray(cols)) {
      cols.filter(item => item.key === key)[0].visible = e.target.checked
    } else {
      cols[key].visible = e.target.checked
    }
    saveStorage(cols)
    onColumnsChange && onColumnsChange(cols)
  }, [columns, saveStorage, onColumnsChange])

  const toggleCheckAll = useCallback((e) => {
    const newValue = e.target.checked
    const cols = Array.isArray(columns) ? [...columns] : { ...columns }
    if (Array.isArray(cols)) {
      cols.forEach(col => col.visible = newValue)
    } else {
      Object.values(cols).forEach(col => col.visible = newValue)
    }
    saveStorage(cols)
    onColumnsChange && onColumnsChange(cols)
  }, [columns, saveStorage, onColumnsChange])

  const transferData = useMemo(() => {
    const cols = Array.isArray(columns) ? columns : Object.values(columns)
    return cols.map((item, index) => ({
      key: String(item.key ?? index),
      label: item.label,
    }))
  }, [columns])

  const transferKeys = useMemo(() => {
    const cols = Array.isArray(columns) ? columns : Object.values(columns)
    return cols.filter(col => col.visible === false).map(col => String(col.key ?? cols.indexOf(col)))
  }, [columns])

  const handleTransferChange = useCallback((targetKeys) => {
    const allKeys = useMemo(() => transferData.map(d => d.key), [transferData])
    const cols = Array.isArray(columns) ? [...columns] : { ...columns }
    
    if (Array.isArray(cols)) {
      cols.forEach((col) => {
        col.visible = !targetKeys.includes(String(col.key ?? cols.indexOf(col)))
      })
    } else {
      Object.keys(cols).forEach((key) => {
        const idx = cols.indexOf(cols[key])
        cols[key].visible = !targetKeys.includes(String(idx))
      })
    }
    saveStorage(cols)
    onColumnsChange && onColumnsChange(cols)
  }, [columns, transferData, saveStorage, onColumnsChange])

  const dropdownItems = useMemo(() => {
    const cols = Array.isArray(columns) ? columns : Object.values(columns)
    return [
      {
        key: 'checkAll',
        label: (
          <Checkbox
            checked={isChecked}
            indeterminate={isIndeterminate}
            onChange={toggleCheckAll}
          >
            列展示
          </Checkbox>
        ),
      },
      {
        key: 'divider',
        type: 'divider',
      },
      ...cols.map((col, index) => ({
        key: col.key ?? index,
        label: (
          <Checkbox
            checked={col.visible}
            onChange={(e) => checkboxChange(e, col.key ?? index)}
          >
            {col.label}
          </Checkbox>
        ),
      })),
    ]
  }, [columns, isChecked, isIndeterminate, toggleCheckAll, checkboxChange])

  const style = {}
  if (gutter !== undefined) {
    style.marginRight = `${gutter / 2}px`
  }

  return (
    <div className="top-right-btn" style={style}>
      <Space>
        {search && (
          <Tooltip title={showSearch ? '隐藏搜索' : '显示搜索'}>
            <Button shape="circle" icon={<SearchOutlined />} onClick={toggleSearch} />
          </Tooltip>
        )}
        <Tooltip title="刷新">
          <Button shape="circle" icon={<ReloadOutlined />} onClick={refresh} />
        </Tooltip>
        {Object.keys(columns).length > 0 && showColumnsType === 'transfer' && (
          <Tooltip title="显隐列">
            <Button shape="circle" icon={<MenuOutlined />} onClick={showColumn} />
          </Tooltip>
        )}
        {Object.keys(columns).length > 0 && showColumnsType === 'checkbox' && (
          <Tooltip title="显隐列">
            <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
              <Button shape="circle" icon={<MenuOutlined />} style={{ marginLeft: 12 }} />
            </Dropdown>
          </Tooltip>
        )}
      </Space>
      <Modal title="显示/隐藏" open={open} onCancel={() => setOpen(false)} footer={null}>
        <Transfer
          titles={['显示', '隐藏']}
          dataSource={transferData}
          targetKeys={transferKeys}
          onChange={handleTransferChange}
          render={item => item.label}
          listStyle={{ width: 200, height: 400 }}
        />
      </Modal>
    </div>
  )
}

export default RightToolbar
