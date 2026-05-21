import request from '@/utils/request'

export function listTable(query) { return request({ url: '/tool/gen/list', method: 'get', params: query }) }
export function getTable(tableId) { return request({ url: '/tool/gen/' + tableId, method: 'get' }) }
export function getTableInfo(tableId) { return request({ url: '/tool/gen/info/' + tableId, method: 'get' }) }
export function addTableInfo(data) { return request({ url: '/tool/gen', method: 'post', data }) }
export function updateTableInfo(data) { return request({ url: '/tool/gen', method: 'put', data }) }
export function delTable(tableIds) { return request({ url: '/tool/gen/' + tableIds, method: 'delete' }) }
export function previewTable(tableId) { return request({ url: '/tool/gen/preview/' + tableId, method: 'get' }) }
export function genCode(tableName) { return request({ url: '/tool/gen/genCode/' + tableName, method: 'get' }) }
export function downloadCode(tableName) { return request({ url: '/tool/gen/download/' + tableName, method: 'post', responseType: 'blob' }) }
export function downloadZip(tableName) { return request({ url: '/tool/gen/batchGenCode', method: 'post', data: { tableNames: tableName }, responseType: 'blob' }) }
export function dbTableList(query) { return request({ url: '/tool/gen/db/list', method: 'get', params: query }) }
export function synchDb(tableName) { return request({ url: '/tool/gen/synchDb/' + tableName, method: 'get' }) }
export function importTable(data) { return request({ url: '/tool/gen/importTable', method: 'post', params: data }) }
