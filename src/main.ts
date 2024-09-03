import { createApp } from 'vue'
import App from './App.vue'
// 引入 element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置 element-plus 国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// svg 插件需要配置代码
import 'virtual:svg-icons-register'

// 引入自定义插件对象：注册整个项目全局组件
import globalComponent from '@/components'

// 引入模版的全局样式
import '@/styles/index.scss'

// 引入路由
import router from './router'

// 引入参考
import pinia from './store'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn, // elemnet-plus 国际化语言配置
})
// 自定义插件
app.use(globalComponent)
// 注册模版路由
app.use(router)
// 安装pinia
app.use(pinia)
app.mount('#app')
