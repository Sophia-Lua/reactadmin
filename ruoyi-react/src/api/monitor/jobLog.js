import request from '@/utils/request'

export function listJobLog(query) { return request({ url: '/monitor/job/log/list', method: 'get', params: query }) }
export function getJobLog(jobLogId) { return request({ url: '/monitor/job/log/' + jobLogId, method: 'get' }) }
export function delJobLog(jobLogId) { return request({ url: '/monitor/job/log/' + jobLogId, method: 'delete' }) }
export function delJobLogAll(jobLogIds) { return request({ url: '/monitor/job/log/' + jobLogIds, method: 'delete' }) }
export function cleanJobLog() { return request({ url: '/monitor/job/log/clean', method: 'delete' }) }
export function exportJobLog(query) { return request({ url: '/monitor/job/log/export', method: 'post', data: query, responseType: 'blob' }) }
