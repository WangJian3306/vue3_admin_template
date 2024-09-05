// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo } from '@/api/user'
// 引入数据类型
import type { loginForm, loginResponseData } from '@/api/user/type'
import type { UserState } from './type/type'
// 引入操作本地存储的工具文件
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由（常量路由）
import { constantRoute } from '@/router/routes'

// 创建用户笑常开
const useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户唯一标识token
      // menuRoutes: constantRoute, // 仓库存储生成菜单需要的数组（路由）
      menuRoutes: constantRoute as [],
      username: '',
      avatar: '',
    }
  },
  // 异步｜逻辑的地方
  actions: {
    async userLogin(data: loginForm) {
      // 登录请求
      const result: loginResponseData = await reqLogin(data)
      // 登录请求：成功200->token
      if (result.code == 200) {
        // pinia 仓库存储一下token
        // 由于 pinia|vuex 存储数据其实用的就是一个js对象
        this.token = result.data.token as string
        SET_TOKEN(result.data.token as string)
        // 保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message))
      }
      // 登录失败：失败201->登录失败错误的信息
    },
    // 获取用户信息方法
    async userInfo() {
      // 获取用户信息存储仓库当中【用户头像，名字】
      const result = await reqUserInfo()
      // 如果获取用户信息成功，存储一下用户信息
      if (result.code == 200) {
        this.username = result.data.checkUser.username
        this.avatar = result.data.checkUser.avatar
        return 'ok'
      } else {
        return Promise.reject('获取用户信息失败')
      }
    },
    // 退出登录
    userLogout() {
      // 目前咩有 mock接口：退出登录接口（通知服务器本地用户唯一标识失效）
      this.token = ''
      this.username = ''
      this.avatar = ''
      REMOVE_TOKEN()
    },
  },
  getters: {},
})

// 对外暴露小仓库
export default useUserStore
