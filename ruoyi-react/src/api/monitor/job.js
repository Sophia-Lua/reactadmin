import request from '@/utils/request'

export function listJob(query) { return request({ url: '/monitor/job/list', method: 'get', params: query }) }
export function getJob(jobId) { return request({ url: '/monitor/job/' + jobId, method: 'get' }) }
export function addJob(data) { return request({ url: '/monitor/job', method: 'post', data }) }
export function updateJob(data) { return request({ url: '/monitor/job', method: 'put', data }) }
export function delJob(jobId) { return request({ url: '/monitor/job/' + jobId, method: 'delete' }) }
export function exportJob(query) { return request({ url: '/monitor/job/export', method: 'post', data: query, responseType: 'blob' }) }
export function jobStatusChange(jobId, status) { return request({ url: '/monitor/job/changeStatus', method: 'put', data: { jobId, status } }) }
export function runJob(jobId, jobGroup) { return request({ url: '/monitor/job/run', method: 'put', data: { jobId, jobGroup } }) }

// Job log
export function listJobLog(query) { return request({ url: '/monitor/job/log/list', method: 'get', params: query }) }
export function delJobLog(jobLogId) { return request({ url: '/monitor/job/log/' + jobLogId, method: 'delete' }) }
export function delJobLogAll(jobLogIds) { return request({ url: '/monitor/job/log/' + jobLogIds, method: 'delete' }) }
export function cleanJobLog() { return request({ url: '/monitor/job/log/clean', method: 'delete' }) }
