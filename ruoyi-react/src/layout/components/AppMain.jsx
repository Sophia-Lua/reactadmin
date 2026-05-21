import React from 'react'
import { Outlet } from 'react-router-dom'

function AppMain() {
  return (
    <section className="app-main" style={{ minHeight: 'calc(100vh - 84px)', position: 'relative', overflow: 'hidden' }}>
      <Outlet />
    </section>
  )
}

export default AppMain
