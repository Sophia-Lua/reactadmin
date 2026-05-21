import React from 'react'

function SwaggerPage() {
  return (
    <div style={{ height: 'calc(100vh - 120px)' }}>
      <iframe
        src={import.meta.env.VITE_APP_BASE_API + '/swagger-ui/index.html'}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Swagger API文档"
      />
    </div>
  )
}

export default SwaggerPage
