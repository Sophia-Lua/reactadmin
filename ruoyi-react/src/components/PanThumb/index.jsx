import React from 'react'

function PanThumb({ image, zIndex = 1, width = '150px', height = '150px', children }) {
  return (
    <div style={{ zIndex, height, width }} className="pan-item">
      <div className="pan-info">
        <div className="pan-info-roles-container">{children}</div>
      </div>
      <div className="pan-thumb" style={{ backgroundImage: `url(${image})` }}></div>
    </div>
  )
}

export default PanThumb
