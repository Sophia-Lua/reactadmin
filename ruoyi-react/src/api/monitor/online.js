import request from '@/utils/request'

export function listOnline(query) { return request({ url: '/monitor/online/list', method: 'get', params: query }) }
export function forceLogout(tokenId) { return request({ url: '/monitor/online/' + tokenId, method: 'delete' }) }
