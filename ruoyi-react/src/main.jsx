import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import store from './store'
import App from './App'
import 'nprogress/nprogress.css'
import './assets/styles/index.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#409EFF' } }}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>
)
