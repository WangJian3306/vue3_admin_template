// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type'
import type { UserState } from './type/type'
// 引入操作本地存储的工具文件
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由（常量路由）
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'

import router from '@/router'

// 用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute:any, routes: any){
  return asyncRoute.filter((item:any)=>{
    if(routes.includes(item.name)){
      if(item.children && item.children.length > 0){
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true;
    }
  })
}

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
    async userLogin(data: loginFormData) {
      // 登录请求
      const result: loginResponseData = await reqLogin(data)
      // 登录请求：成功200->token
      if (result.code == 200) {
        // pinia 仓库存储一下token
        // 由于 pinia|vuex 存储数据其实用的就是一个js对象
        this.token = result.data as string
        SET_TOKEN(result.data as string)
        // 保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
      // 登录失败：失败201->登录失败错误的信息
    },
    // 获取用户信息方法
    async userInfo() {
      // 获取用户信息存储仓库当中【用户头像，名字】
      const result: userInfoResponseData = await reqUserInfo()
      // 如果获取用户信息成功，存储一下用户信息
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        // 计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(asyncRoute,result.data.routes)
        // 菜单需要的数据
        this.menuRoutes = [...constantRoute,...userAsyncRoute,...anyRoute]
        // 目前路由器管理的只有常量路由，用户计算完毕的异步路由和任意路由需要动态添加
        const newRoutes = [...userAsyncRoute, ...anyRoute]
        newRoutes.forEach((route:any)=>{
          router.addRoute(route)
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogout() {
      const result: any = await reqLogout()
      if (result.code == 200) {
        // 目前咩有 mock接口：退出登录接口（通知服务器本地用户唯一标识失效）
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

// 对外暴露小仓库
export default useUserStore
