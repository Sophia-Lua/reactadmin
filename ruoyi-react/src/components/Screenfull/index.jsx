import React from 'react'
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import screenfull from 'screenfull'

function Screenfull() {
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const handleClick = () => {
    if (!screenfull.isEnabled) {
      return
    }
    screenfull.toggle()
  }

  React.useEffect(() => {
    if (!screenfull.isEnabled) return

    const onChange = () => {
      setIsFullscreen(screenfull.isFullscreen)
    }

    screenfull.on('change', onChange)
    return () => {
      screenfull.off('change', onChange)
    }
  }, [])

  return (
    <div className="screenfull-container" onClick={handleClick} style={{ padding: '0 12px', cursor: 'pointer' }}>
      {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
    </div>
  )
}

export default Screenfull
