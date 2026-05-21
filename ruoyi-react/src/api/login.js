import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}

// 注册
export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data,
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get',
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get',
  })
}
