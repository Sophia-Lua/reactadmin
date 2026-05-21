/**
 * 判断值是否为空
 */
export function isEmpty(value) {
  if (value == null || value === '' || value === undefined) {
    return true
  }
  if (Array.isArray(value) && value.length === 0) {
    return true
  }
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true
  }
  return false
}

/**
 * 判断是否为URL
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)?((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * 判断是否为小写字母
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * 判断是否为大写字母
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * 判断是否为字母
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 判断是否为邮箱
 */
export function isEmail(str) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(str)
}

/**
 * 判断是否为手机号码
 */
export function isPhone(str) {
  const reg = /^1[0-9]{10}$/
  return reg.test(str)
}

/**
 * 判断是否为中文
 */
export function isChinese(str) {
  const reg = /^[\u4e00-\u9fa5]+$/
  return reg.test(str)
}

/**
 * 判断是否为整数
 */
export function isInteger(str) {
  const reg = /^[0-9]+$/
  return reg.test(str)
}

/**
 * 判断是否包含非法字符
 */
export function validateName(str) {
  const reg = /[`~!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~！@#￥%……&*（）——+\-【】{}；'："|，。《》/？·]/
  return !reg.test(str)
}
