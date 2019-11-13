/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^[1][3,4,5,7,8][0-9]{9}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

export function validUsername(str) {
  const reg = /^[a-zA-Z0-9]{1,32}$/
  return reg.test(str)
}

export function validPointName(str) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,32}$/
  return reg.test(str)
}

export function validAddress(str) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,50}$/
  return reg.test(str)
}

export function validPassword(str) {
  const reg = /^[a-zA-Z0-9@_?=.]{6,32}$/
  return reg.test(str)
}
