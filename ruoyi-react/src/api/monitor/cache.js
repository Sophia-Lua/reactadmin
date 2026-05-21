import request from '@/utils/request'

export function getCache() { return request({ url: '/monitor/cache', method: 'get' }) }
export function listCacheName() { return request({ url: '/monitor/cache/getNames', method: 'get' }) }
export function getCacheKeys() { return request({ url: '/monitor/cache/getKeys', method: 'get' }) }
export function getCacheValue(cacheName, cacheKey) { return request({ url: '/monitor/cache/getValue/' + cacheName + '/' + cacheKey, method: 'get' }) }
export function clearCacheName(cacheName) { return request({ url: '/monitor/cache/clearCacheName/' + cacheName, method: 'delete' }) }
export function clearCacheKey(cacheKey) { return request({ url: '/monitor/cache/clearCacheKey/' + cacheKey, method: 'delete' }) }
export function clearCacheAll() { return request({ url: '/monitor/cache/clearCacheAll', method: 'delete' }) }
