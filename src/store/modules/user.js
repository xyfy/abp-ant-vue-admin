import storage from 'store'
import { login, getInfo, logout, changetenant } from '@/api/login'
import { ACCESS_TOKEN, TENANT } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: {},
    tenant: {},
    name: '',
    welcome: '',
    avatar: '',
    permissionList: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_TENANT: (state, tenant) => {
      state.tenant = tenant
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    ChangeTenant ({ commit }, tenantName = 'Default') {
      return new Promise((resolve, reject) => {
        changetenant(tenantName)
          .then(data => {
            data = data || {}
            storage.set(TENANT, data, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TENANT', data)
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(data => {
            const token = {
              ...data,
              expire_time: new Date().valueOf() + data.expires_in,
              scope: undefined
            }
            storage.set(ACCESS_TOKEN, token, data.expires_in)
            commit('SET_TOKEN', token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(response => {
            const result = response
            const info = result.currentUser
            if (result.currentUser.isAuthenticated) {
              commit('SET_AVATAR', result.avatar) // 头像
              commit('SET_NAME', { name: info.userName, welcome: welcome() })
            }
            if (result.currentTenant.isAvailable) {
              storage.set(TENANT, result.currentTenant, 7 * 24 * 60 * 60 * 1000)
              commit('SET_TENANT', result.currentTenant)
            }
            info.permissionList = Object.keys(result.auth.grantedPolicies) // 把已有权限的字符串赋值给数组
            commit('SET_PERMISSIONLIST', info.permissionList)
            commit('SET_INFO', info)
            resolve(info)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise(resolve => {
        logout(state.token)
          .then(() => {
            resolve()
          })
          .catch(() => {
            resolve()
          })
          .finally(() => {
            commit('SET_TOKEN', {})
            commit('SET_INFO', {})
            commit('SET_TENANT', {})
            commit('SET_PERMISSIONLIST', [])
            commit('SET_NAME', '')
            storage.remove(ACCESS_TOKEN)
          })
      })
    }
  }
}

export default user
