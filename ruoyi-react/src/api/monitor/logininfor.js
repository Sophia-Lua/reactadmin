import request from '@/utils/request'

export function listLoginLog(query) { return request({ url: '/monitor/logininfor/list', method: 'get', params: query }) }
export function delLoginLog(infoId) { return request({ url: '/monitor/logininfor/' + infoId, method: 'delete' }) }
export function delLoginLogAll(infoIds) { return request({ url: '/monitor/logininfor/' + infoIds, method: 'delete' }) }
export function cleanLoginLog() { return request({ url: '/monitor/logininfor/clean', method: 'delete' }) }
export function unlockLoginLog(userName) { return request({ url: '/monitor/logininfor/unlock/' + userName, method: 'get' }) }
