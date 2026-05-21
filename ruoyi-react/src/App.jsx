import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './layout'
import Login from './pages/login'
import Register from './pages/register'
import NotFound404 from './pages/error/404'
import NotFound401 from './pages/error/401'
import Lock from './pages/lock'
import Redirect from './pages/redirect'
import Dashboard from './pages/dashboard'
import { useDispatch, useSelector } from 'react-redux'
import { getInfoAction } from './store/slices/userSlice'

// Dynamic route components
const ProfilePage = React.lazy(() => import('./pages/system/user/profile'))
const UserRoleAuth = React.lazy(() => import('./pages/system/user/authRole'))
const UserView = React.lazy(() => import('./pages/system/user/view'))
const RoleUserAuth = React.lazy(() => import('./pages/system/role/authUser'))
const DictDataPage = React.lazy(() => import('./pages/system/dict/data'))
const DictDetail = React.lazy(() => import('./pages/system/dict/detail'))
const JobLogPage = React.lazy(() => import('./pages/monitor/job/log'))
const JobDetail = React.lazy(() => import('./pages/monitor/job/detail'))
const GenEditPage = React.lazy(() => import('./pages/tool/gen/editTable'))
const OperLogDetail = React.lazy(() => import('./pages/monitor/operlog/detail'))
const ReadUsers = React.lazy(() => import('./pages/system/notice/ReadUsers'))
const SelectUser = React.lazy(() => import('./pages/system/role/selectUser'))
const ImportTable = React.lazy(() => import('./pages/tool/gen/importTable'))
const DruidPage = React.lazy(() => import('./pages/monitor/druid'))

// System management
const UserPage = React.lazy(() => import('./pages/system/user'))
const DeptPage = React.lazy(() => import('./pages/system/dept'))
const MenuPage = React.lazy(() => import('./pages/system/menu'))
const DictPage = React.lazy(() => import('./pages/system/dict'))
const RolePage = React.lazy(() => import('./pages/system/role'))
const PostPage = React.lazy(() => import('./pages/system/post'))
const NoticePage = React.lazy(() => import('./pages/system/notice'))
const ConfigPage = React.lazy(() => import('./pages/system/config'))

// Monitor
const ServerPage = React.lazy(() => import('./pages/monitor/server'))
const CachePage = React.lazy(() => import('./pages/monitor/cache'))
const OnlinePage = React.lazy(() => import('./pages/monitor/online'))
const LoginLogPage = React.lazy(() => import('./pages/monitor/logininfor'))
const OperLogPage = React.lazy(() => import('./pages/monitor/operlog'))
const JobPage = React.lazy(() => import('./pages/monitor/job'))

// Tool
const GenPage = React.lazy(() => import('./pages/tool/gen'))
const BuildPage = React.lazy(() => import('./pages/tool/build'))
const SwaggerPage = React.lazy(() => import('./pages/tool/swagger'))

// Route guard component
function RequireAuth({ children }) {
  const token = useSelector(state => state.user.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/404" element={<NotFound404 />} />
      <Route path="/401" element={<NotFound401 />} />
      <Route path="/lock" element={<Lock />} />
      <Route path="/redirect/*" element={<Redirect />} />

      <Route path="/" element={
        <RequireAuth>
          <Layout />
        </RequireAuth>
      }>
        <Route index element={<Navigate to="/index" replace />} />
        <Route path="index" element={<Dashboard />} />
        <Route path="user/profile" element={<ProfilePage />} />

        {/* System Management */}
        <Route path="system/user" element={<UserPage />} />
        <Route path="system/user-auth/role/:userId" element={<UserRoleAuth />} />
        <Route path="system/user/view/:userId" element={<UserView />} />
        <Route path="system/dept" element={<DeptPage />} />
        <Route path="system/menu" element={<MenuPage />} />
        <Route path="system/role" element={<RolePage />} />
        <Route path="system/role-auth/user/:roleId" element={<RoleUserAuth />} />
        <Route path="system/post" element={<PostPage />} />
        <Route path="system/dict" element={<DictPage />} />
        <Route path="system/dict-data/index/:dictId" element={<DictDataPage />} />
        <Route path="system/dict-detail/:dictId" element={<DictDetail />} />
        <Route path="system/config" element={<ConfigPage />} />
        <Route path="system/notice" element={<NoticePage />} />
        <Route path="system/notice/read-users/:noticeId" element={<ReadUsers />} />

        {/* Monitor */}
        <Route path="monitor/server" element={<ServerPage />} />
        <Route path="monitor/cache" element={<CachePage />} />
        <Route path="monitor/cache/list" element={<CachePage />} />
        <Route path="monitor/online" element={<OnlinePage />} />
        <Route path="monitor/logininfor" element={<LoginLogPage />} />
        <Route path="monitor/operlog" element={<OperLogPage />} />
        <Route path="monitor/operlog/detail" element={<OperLogDetail />} />
        <Route path="monitor/job" element={<JobPage />} />
        <Route path="monitor/job-log/index/:jobId" element={<JobLogPage />} />
        <Route path="monitor/job-detail/:jobId" element={<JobDetail />} />
        <Route path="monitor/druid" element={<DruidPage />} />

        {/* Tool */}
        <Route path="tool/gen" element={<GenPage />} />
        <Route path="tool/gen-edit/index/:tableId" element={<GenEditPage />} />
        <Route path="tool/gen-import" element={<ImportTable />} />
        <Route path="tool/build" element={<BuildPage />} />
        <Route path="tool/swagger" element={<SwaggerPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default App
