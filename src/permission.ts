// 路由鉴权：鉴权，项目当中路由能不能被访问的权限设置
import router from '@/router'
import { type RouteLocationNormalized } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 全局守卫：项目当中人意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
  // to： 目标路由
  // from：源路由
  // next：路由放行函数
  NProgress.start()
  next()
})

// 全局后置守卫
router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // to： 目标路由
  // from：源路由
  NProgress.done()
})

// 第一个问题：任意路由切换实现进度条显示 nprogress
