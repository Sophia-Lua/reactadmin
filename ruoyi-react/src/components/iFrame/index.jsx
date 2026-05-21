import React from 'react'

function IFrame({ url }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <iframe src={url} frameBorder="0" style={{ width: '100%', height: '100%' }}></iframe>
    </div>
  )
}

export default IFrame
