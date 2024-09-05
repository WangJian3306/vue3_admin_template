// 路由鉴权：鉴权，项目当中路由能不能被访问的权限设置
import router from '@/router'
import { type RouteLocationNormalized } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import setting from './setting'

// 获取用户小仓库token数据，判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'

NProgress.configure({ showSpinner: false })

const userStore = useUserStore(pinia)

// 全局守卫：项目当中人意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
  // to： 目标路由
  // from：源路由
  // next：路由放行函数

  NProgress.start()

  // 获取token，判断用户是否登录
  const token = userStore.token

  // 获取用户名字
  const username = userStore.username

  // 用户登录判断
  if (token) {
    // 登录成功，访问login，重定向到首页
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 访问其余路由
      // 有用户信息
      if (username) {
        // 放行
        next()
      } else {
        // 获取用户信息后放行
        try {
          await userStore.userInfo()
          next()
        } catch (error) {
          // token 过期：获取不到用户信息了
          // 退出登录->用户相关的数据清空
          userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 用户未登录
    if (to.path === '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }

  next()
})

// 全局后置守卫
router.afterEach((to: RouteLocationNormalized) => {
  // to： 目标路由
  // from：源路由
  NProgress.done()

  // 修改页面标题
  document.title = `${setting.title}-${to.meta.title}`
})

// 第一个问题：任意路由切换实现进度条显示 nprogress
// 第二个问题：路由组件访问权限设置

// 用户未登录：可以访问login，其余路由不能访问（重定向到 login）
// 用户登录成功：访问 login 自动重定向到首页，其余路由可以访问
