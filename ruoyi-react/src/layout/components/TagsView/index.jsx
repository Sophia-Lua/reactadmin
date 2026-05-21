import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Tag, Dropdown } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  addView,
  delView,
  delOthersViews,
  delAllViews,
  delLeftViews,
  delRightViews,
  setSelectedTag,
} from '@/store/slices/tagsViewSlice'

function TagsView() {
  const visitedViews = useSelector(state => state.tagsView.visitedViews)
  const selectedTag = useSelector(state => state.tagsView.selectedTag)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const route = location
    dispatch(addView({
      name: route.name || route.pathname,
      title: route.meta?.title || route.pathname,
      path: route.pathname,
      fullPath: route.pathname,
      affix: route.meta?.affix,
    }))
  }, [location, dispatch])

  const handleClick = (view) => {
    navigate(view.path)
    dispatch(setSelectedTag(view))
  }

  const handleClose = (view) => {
    dispatch(delView(view.path))
    if (selectedTag.path === view.path) {
      const lastView = visitedViews.filter(v => v.path !== view.path).pop()
      if (lastView) {
        navigate(lastView.path)
      }
    }
  }

  const tagItems = (view) => [
    { key: 'refresh', label: '刷新页面' },
    { key: 'close', label: '关闭当前' },
    { key: 'closeOthers', label: '关闭其他' },
    { key: 'closeLeft', label: '关闭左侧' },
    { key: 'closeRight', label: '关闭右侧' },
    { type: 'divider' },
    { key: 'closeAll', label: '关闭全部' },
  ]

  const handleTagAction = ({ key }, view) => {
    switch (key) {
      case 'close':
        handleClose(view)
        break
      case 'closeOthers':
        dispatch(delOthersViews(view.path))
        navigate(view.path)
        break
      case 'closeLeft':
        dispatch(delLeftViews(view.path))
        break
      case 'closeRight':
        dispatch(delRightViews(view.path))
        break
      case 'closeAll':
        dispatch(delAllViews())
        navigate('/')
        break
      default:
        break
    }
  }

  return (
    <div className="tags-view-container" style={{ height: 34, lineHeight: '34px', background: '#fff', borderBottom: '1px solid #d8dce5', padding: '0 8px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <div ref={scrollContainerRef} className="tags-view-wrapper" style={{ display: 'inline-block' }}>
        {visitedViews.map(view => (
          <Dropdown
            key={view.path}
            menu={{ items: tagItems(view), onClick: (e) => handleTagAction(e, view) }}
            trigger={['contextMenu']}
          >
            <Tag
              color={selectedTag.path === view.path ? '#409EFF' : undefined}
              closable={!view.affix}
              onClose={() => handleClose(view)}
              style={{
                marginRight: 4,
                marginBottom: 0,
                cursor: 'pointer',
                borderRadius: 3,
                padding: '0 8px',
              }}
              onClick={() => handleClick(view)}
            >
              {view.title}
            </Tag>
          </Dropdown>
        ))}
      </div>
    </div>
  )
}

export default TagsView
