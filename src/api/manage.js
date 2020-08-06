import request from '@/utils/request'

const api = {
  user: process.env.VUE_APP_API_BASE_URL + '/user',
  role: process.env.VUE_APP_API_BASE_URL + '/role',
  service: process.env.VUE_APP_API_BASE_URL + '/service',
  permission: process.env.VUE_APP_API_BASE_URL + '/permission',
  permissionNoPager: process.env.VUE_APP_API_BASE_URL + '/permission/no-pager',
  orgTree: process.env.VUE_APP_API_BASE_URL + '/org/tree'
}

export default api

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}
