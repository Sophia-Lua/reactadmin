import store from '@/store'

/**
 * 字符权限校验
 * @param {Array} value 权限标识数组
 */
export function checkPermi(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getState().user.permissions || []
    const permissionDatas = value
    const all_permission = '*:*:*'

    const hasPermission = permissions.some(permission => {
      return all_permission === permission || permissionDatas.includes(permission)
    })

    return hasPermission
  } else {
    console.error('need roles! like checkPermi="[' + value + ']"')
    return false
  }
}

/**
 * 角色权限校验
 * @param {Array} value 角色标识数组
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getState().user.roles || []
    const super_admin = 'admin'
    const hasRole = roles.some(role => {
      return super_admin === role || value.includes(role)
    })

    return hasRole
  } else {
    console.error('need roles! like checkRole="[' + value + ']"')
    return false
  }
}
