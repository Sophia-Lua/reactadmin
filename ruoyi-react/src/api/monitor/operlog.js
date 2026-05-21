import request from '@/utils/request'

export function listOperLog(query) { return request({ url: '/monitor/operlog/list', method: 'get', params: query }) }
export function delOperLog(operId) { return request({ url: '/monitor/operlog/' + operId, method: 'delete' }) }
export function delOperLogAll(operIds) { return request({ url: '/monitor/operlog/' + operIds, method: 'delete' }) }
export function cleanOperLog() { return request({ url: '/monitor/operlog/clean', method: 'delete' }) }
