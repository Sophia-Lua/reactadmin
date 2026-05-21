import axios from 'axios'
import { message, Modal, notification } from 'antd'
import store from '@/store'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from '@/utils/ruoyi'
import cache from '@/plugins/cache'
import { saveAs } from 'file-saver'

let downloadLoadingInstance = null

export const isRelogin = { show: false }

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
})

service.interceptors.request.use(config => {
  const isToken = (config.headers || {}).isToken === false
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  const interval = (config.headers || {}).interval || 1000

  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken()
  }

  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  }

  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime(),
    }
    const requestSize = Object.keys(JSON.stringify(requestObj)).length
    const limitSize = 5 * 1024 * 1024

    if (requestSize >= limitSize) {
      console.warn(`[${config.url}]: 请求数据大小超出允许的5M限制，无法进行防重复提交验证。`)
      return config
    }

    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const { url: s_url, data: s_data, time: s_time } = sessionObj
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const msg = '数据正在处理，请勿重复提交'
        console.warn(`[${s_url}]: ${msg}`)
        return Promise.reject(new Error(msg))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }

  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})

service.interceptors.response.use(res => {
  const code = res.data.code || 200
  const msg = errorCode[code] || res.data.msg || errorCode['default']

  if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
    return res.data
  }

  if (code === 401) {
    if (!isRelogin.show) {
      isRelogin.show = true
      Modal.confirm({
        title: '系统提示',
        content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
        okText: '重新登录',
        cancelText: '取消',
        onOk: () => {
          isRelogin.show = false
          store.dispatch('user/logoutAction').then(() => {
            window.location.href = '/index'
          })
        },
        onCancel: () => {
          isRelogin.show = false
        },
      })
    }
    return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
  } else if (code === 500) {
    message.error(msg)
    return Promise.reject(new Error(msg))
  } else if (code === 601) {
    message.warning(msg)
    return Promise.reject('error')
  } else if (code !== 200) {
    notification.error({ message: msg })
    return Promise.reject('error')
  } else {
    return res.data
  }
}, error => {
  console.log('err' + error)
  let { message } = error
  if (message === 'Network Error') {
    message = '后端接口连接异常'
  } else if (message.includes('timeout')) {
    message = '系统接口请求超时'
  } else if (message.includes('Request failed with status code')) {
    message = '系统接口' + message.slice(-3) + '异常'
  }
  message.error({ content: message, duration: 5 })
  return Promise.reject(error)
})

export function download(url, params, filename, config) {
  return service.post(url, params, {
    transformRequest: [(params) => tansParams(params)],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    ...config,
  }).then(async (data) => {
    const isBlob = blobValidate(data)
    if (isBlob) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text()
      const rspObj = JSON.parse(resText)
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      message.error(errMsg)
    }
  }).catch(() => {
    message.error('下载文件出现错误，请联系管理员！')
  })
}

export default service
