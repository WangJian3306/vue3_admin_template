// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'

// 全局对象
const allGlobalComponent: any = { SvgIcon, Pagination }

// 对外暴露插件对象
export default {
  // 务必叫作 install 方法
  install(app: any) {
    // 注册项目全部的全局组件
    Object.keys(allGlobalComponent).forEach((key) => {
      // 注册为全局组件
      app.component(key, allGlobalComponent[key])
    })
  },
}
