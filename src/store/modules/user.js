import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          // const tokenStr = data.tokenHead+data.token
          const tokenStr = "JWT "+response.Token
          // console.log(tokenStr)
          setToken(tokenStr)
          commit('SET_TOKEN', tokenStr)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          // const data = response.data
          const data = response.data
          const data1 = data.data[0]

          const info = {
            "roles": [
                "TEST"
            ],
            "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg.jpg",
            "menus": [
                {
                    "id": 1,
                    "parentId": 0,
                    "createTime": "2020-02-02T06:50:36.000+0000",
                    "title": "商品",
                    "level": 0,
                    "sort": 0,
                    "name": "pms",
                    "icon": "product",
                    "hidden": 0
                },
                {
                    "id": 2,
                    "parentId": 1,
                    "createTime": "2020-02-02T06:51:50.000+0000",
                    "title": "商品列表",
                    "level": 1,
                    "sort": 0,
                    "name": "product",
                    "icon": "product-list",
                    "hidden": 0
                },
                {
                    "id": 3,
                    "parentId": 1,
                    "createTime": "2020-02-02T06:52:44.000+0000",
                    "title": "添加商品",
                    "level": 1,
                    "sort": 0,
                    "name": "addProduct",
                    "icon": "product-add",
                    "hidden": 0
                },
                {
                    "id": 4,
                    "parentId": 1,
                    "createTime": "2020-02-02T06:53:51.000+0000",
                    "title": "商品分类",
                    "level": 1,
                    "sort": 0,
                    "name": "productCate",
                    "icon": "product-cate",
                    "hidden": 0
                },
                {
                    "id": 5,
                    "parentId": 1,
                    "createTime": "2020-02-02T06:54:51.000+0000",
                    "title": "商品类型",
                    "level": 1,
                    "sort": 0,
                    "name": "productAttr",
                    "icon": "product-attr",
                    "hidden": 0
                }
            ],
            "username": "admin"
        }
          // console.log(info)
          if (data.role && data.role.length > 0) { // 验证返回的roles是否是一个非空数组
            // console.log(data.role)
            // console.log(data1.user.name)
            // console.log(data1.menus)

            commit('SET_ROLES', data.role)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data1.user.name)
          commit('SET_AVATAR', data1.icon)
          // resolve(response)
          resolve(data1)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
