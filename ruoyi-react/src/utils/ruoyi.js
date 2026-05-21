import dayjs from 'dayjs'

/**
 * 时间格式化
 */
export function parseTime(time, pattern) {
  if (!time) return ''
  pattern = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  return pattern.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    return value.toString().padStart(result.length, '0')
  })
}

/**
 * 表单重置
 */
export function resetForm(refName) {
  if (refName && refName.current) {
    refName.current.resetFields()
  }
}

/**
 * 添加日期范围
 */
export function addDateRange(params, dateRange, propName) {
  const search = { ...params }
  if (dateRange != null && dateRange !== '' && dateRange.length === 2) {
    const beginTime = dateRange[0] ? (typeof dateRange[0].format === 'function' ? dateRange[0].format('YYYY-MM-DD') : dateRange[0]) : undefined
    const endTime = dateRange[1] ? (typeof dateRange[1].format === 'function' ? dateRange[1].format('YYYY-MM-DD') : dateRange[1]) : undefined
    if (typeof propName === 'undefined') {
      search.beginTime = beginTime
      search.endTime = endTime
    } else {
      search['begin' + propName] = beginTime
      search['end' + propName] = endTime
    }
  }
  return search
}

/**
 * 字典标签回显
 */
export function selectDictLabel(datas, value) {
  if (value === undefined) return ''
  const actions = []
  Object.keys(datas).some((key) => {
    if (datas[key].dictValue === value + '') {
      actions.push(datas[key].dictLabel)
      return true
    }
  })
  if (actions.length === 0) {
    actions.push(value)
  }
  return actions.join('')
}

/**
 * 多个字典标签回显
 */
export function selectDictLabels(datas, value, separator) {
  if (value === undefined || value === '') return ''
  const actions = []
  const currentSeparator = separator || ','
  const temp = value.split(currentSeparator)
  Object.keys(temp).some((val) => {
    let match = false
    Object.keys(datas).some((key) => {
      if (datas[key].dictValue === temp[val]) {
        actions.push(datas[key].dictLabel + currentSeparator)
        match = true
      }
    })
    if (!match) {
      actions.push(temp[val] + currentSeparator)
    }
  })
  return actions.join('').substring(0, actions.join('').length - 1)
}

/**
 * 字符串格式化
 */
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    if (value !== void 0 && value !== null && value !== '') {
      result += encodeURIComponent(propName) + '=' + encodeURIComponent(value) + '&'
    }
  }
  return result
}

/**
 * 校验 blob 是否有效
 */
export function blobValidate(data) {
  return data.type !== 'application/json'
}

/**
 * 构造树型结构数据
 */
export function handleTree(data, id, parentId, children) {
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children',
  }

  const childrenListMap = {}
  const nodeIds = {}
  const tree = []

  for (const d of data) {
    const parentId = d[config.parentId]
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = []
    }
    nodeIds[d[config.id]] = d
    childrenListMap[parentId].push(d)
  }

  for (const d of data) {
    const parentId = d[config.parentId]
    if (nodeIds[parentId] == null) {
      tree.push(d)
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]]
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c)
      }
    }
  }
  return tree
}

/**
 * 日期转换
 */
export function downloadFileName(disposition) {
  if (disposition && disposition.includes('filename')) {
    const filenameMatch = disposition.match(/filename="?([^"]+)"?/)
    if (filenameMatch) {
      return decodeURIComponent(filenameMatch[1])
    }
  }
  return ''
}

/**
 * 获取指定范围内的随机数
 */
export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 数组去重
 */
export function unique(arr) {
  return Array.from(new Set(arr))
}

/**
 * 深拷贝
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (obj instanceof Object) {
    const copy = {}
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key])
    })
    return copy
  }
}
