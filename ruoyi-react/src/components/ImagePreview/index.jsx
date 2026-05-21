import React from 'react'
import { Image } from 'antd'
import { isExternal } from '@/utils/validate'

function ImagePreview({ src, width, height }) {
  const realSrc = src?.split(',')[0] ?? ''
  const realSrcList = src?.split(',').map(item => isExternal(item) ? item : import.meta.env.VITE_APP_BASE_API + item) ?? []

  const style = {
    borderRadius: 5,
    backgroundColor: '#ebeef5',
    boxShadow: '0 0 5px 1px #ccc',
    width: typeof width === 'string' ? width : `${width}px`,
    height: typeof height === 'string' ? height : `${height}px`,
    overflow: 'hidden',
  }

  const imgStyle = {
    transition: 'all 0.3s',
    cursor: 'pointer',
  }

  return (
    <div style={style} className="image-preview">
      {realSrc ? (
        <Image
          src={isExternal(realSrc) ? realSrc : import.meta.env.VITE_APP_BASE_API + realSrc}
          preview={{ srcList: realSrcList }}
          style={imgStyle}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', color: '#909399', fontSize: 30 }}>
          图片加载失败
        </div>
      )}
    </div>
  )
}

export default ImagePreview
