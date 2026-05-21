import React, { useState } from 'react'

function IframeToggle({ url, visible }) {
  if (!visible) return null
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <iframe src={url} style={{ width: '100%', height: '100%', border: 'none' }} title="Iframe" />
    </div>
  )
}

export default IframeToggle
