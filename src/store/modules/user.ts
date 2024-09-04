// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin } from '@/api/user'
// 引入数据类型
import type { loginForm, loginResponseData } from '@/api/user/type'
import type { UserState } from './type/type'
// 引入操作本地存储的工具文件
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'

// 创建用户笑常开
const useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户唯一标识token
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
  },
  getters: {},
})

// 对外暴露小仓库
export default useUserStore
