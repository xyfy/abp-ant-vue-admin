import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN, TENANT, APP_LANGUAGE } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = error => {
  const errorRes = error.response
  if (errorRes) {
    // 从 localstorage 获取 token
    let token = storage.get(ACCESS_TOKEN)
    if (token && token.access_token) {
      token = token.access_token
    }
    if (errorRes.headers._abperrorformat && errorRes.status === 401) {
      store.dispatch('Logout').then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
    }
    const err = getError(errorRes.data.error || {}, errorRes.status)
    notification.error({
      message: err.title,
      description: err.message
    })
  } else {
    notification.error('An unexpected error has occurred')
  }

  return Promise.reject(error)
}
function getError ({ error = {}, status }) {
  let message = ''
  let title = '发生错误'

  if (typeof error === 'string') {
    message = error
  } else if (error.details) {
    message = error.details
    title = error.message
  } else if (error.message) {
    message = error.message
  } else {
    switch (status) {
      case 401:
        title = '未登录'
        message = '您还没有登录到系统'
        break
      case 403:
        title = '未授权'
        message = '您还没有对应的操作权限'
        break
      case 404:
        title = '未找到'
        message = '资源不存在'
        break
      case 500:
        title = '内部错误'
        message = '系统发生了内部错误'
        break
      default:
        break
    }
  }
  return { title, message }
}
// request interceptor
request.interceptors.request.use(async request => {
  const token = storage.get(ACCESS_TOKEN)
  const tenant = storage.get(TENANT)
  const language = storage.get(APP_LANGUAGE)

  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (!request.headers.Authorization && token && token.access_token) {
    request.headers.Authorization = `${token.token_type} ${token.access_token}`
  }
  if (!request.headers['Content-Type']) {
    request.headers['Content-Type'] = 'application/json'
  }
  if (!request.headers['Accept-Language'] && language) {
    request.headers['Accept-Language'] = language
  }

  if (!request.headers.__tenant && tenant && tenant.tenantId) {
    request.headers.__tenant = tenant.tenantId
  }

  return request
}, errorHandler)

// response interceptor
request.interceptors.response.use(response => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export { installer as VueAxios, request as axios }
