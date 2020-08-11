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
    roles: [],
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
    SET_ROLES: (state, roles) => {
      state.roles = roles
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
            const result = response.result

            if (result.role && result.role.permissions.length > 0) {
              const role = result.role
              role.permissions = result.role.permissions
              role.permissions.map(per => {
                if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                  const action = per.actionEntitySet.map(action => {
                    return action.action
                  })
                  per.actionList = action
                }
              })
              role.permissionList = role.permissions.map(permission => {
                return permission.permissionId
              })
              commit('SET_ROLES', result.role)
              commit('SET_INFO', result)
            } else {
              reject(new Error('getInfo: roles must be a non-null array !'))
            }

            commit('SET_NAME', { name: result.name, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)

            resolve(response)
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
            commit('SET_TENANT', {})
            commit('SET_ROLES', [])
            storage.remove(ACCESS_TOKEN)
          })
      })
    }
  }
}

export default user
