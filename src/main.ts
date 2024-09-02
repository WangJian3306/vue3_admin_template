import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

const fun = () =>
{
    console.log("这是没有格式化的代码");
}
fun();