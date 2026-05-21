import request from '@/utils/request'

export function listDictType(query) { return request({ url: '/system/dict/type/list', method: 'get', params: query }) }
export function getDictType(dictId) { return request({ url: '/system/dict/type/' + dictId, method: 'get' }) }
export function addDictType(data) { return request({ url: '/system/dict/type', method: 'post', data }) }
export function updateDictType(data) { return request({ url: '/system/dict/type', method: 'put', data }) }
export function delDictType(dictId) { return request({ url: '/system/dict/type/' + dictId, method: 'delete' }) }
export function refreshCache() { return request({ url: '/system/dict/type/refreshCache', method: 'delete' }) }
export function optionselect() { return request({ url: '/system/dict/type/optionselect', method: 'get' }) }
