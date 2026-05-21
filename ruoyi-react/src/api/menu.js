import request from '@/utils/request'

// 获取路由
export const listMenus = () => request({
  url: '/getRouters',
  method: 'get',
})
