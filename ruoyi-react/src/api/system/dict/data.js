import request from '@/utils/request'

export function getDicts(dictType) { return request({ url: '/system/dict/data/type/' + dictType, method: 'get' }) }
export function listDictData(query) { return request({ url: '/system/dict/data/list', method: 'get', params: query }) }
export function getDictData(dictCode) { return request({ url: '/system/dict/data/' + dictCode, method: 'get' }) }
export function listDictDataByType(dictType) { return request({ url: '/system/dict/data/type/' + dictType, method: 'get' }) }
export function addDictData(data) { return request({ url: '/system/dict/data', method: 'post', data }) }
export function updateDictData(data) { return request({ url: '/system/dict/data', method: 'put', data }) }
export function delDictData(dictCode) { return request({ url: '/system/dict/data/' + dictCode, method: 'delete' }) }
