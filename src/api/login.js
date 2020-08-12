import request from '@/utils/request'
import apiConfig from './config'
const userApi = {
  Login: '/connect/token',
  ChangeTenant: '/api/abp/multi-tenancy/tenants/by-name/',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/api/abp/application-configuration',
  UserMenu: '/user/nav'
}

export function changetenant (tenantName) {
  return request({
    method: 'GET',
    url: userApi.ChangeTenant + tenantName,
    baseURL: apiConfig.authConfig.issuer
  })
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  const formData = new FormData()
  formData.append('username', parameter.username)
  formData.append('email', parameter.username)
  formData.append('password', parameter.password)
  formData.append('grant_type', 'password')
  if (apiConfig.authConfig.scope) {
    formData.append('scope', `${apiConfig.authConfig.scope} offline_access`)
  }
  formData.append('client_id', apiConfig.authConfig.clientId)
  formData.append('client_secret', apiConfig.authConfig.dummyClientSecret)

  return request({
    method: 'POST',
    url: userApi.Login,
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    baseURL: apiConfig.authConfig.issuer
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    baseURL: apiConfig.apis.default.url,
    method: 'get'
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}
