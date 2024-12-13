<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>

  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <!-- 表单元素 -->
    <el-form>
      <el-form-item label="主题颜色">
        <!-- teleported: 是否将 popover 的下拉列表渲染至 body 下，false的目的是将其渲染只 el-popover 下，防止 el-popover 自动关闭 -->
        <el-color-picker
          v-model="color"
          show-alpha
          :predefine="predefineColors"
          size="small"
          :teleported="false"
          @change="setColor"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          @change="changeDark"
          v-model="dark"
          size="small"
          inline-prompt
          active-icon="MoonNight"
          inactive-icon="Sunny"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup name="Setting">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// 获取layout的小仓库
import useLayOutSettingStore from '@/store/modules/tabbar'
const LayOutSettingStore = useLayOutSettingStore()
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
// 获取路由器对象
const $router = useRouter()
// 获取路由对象
const $route = useRoute()
// 收集开关的数据
let dark = ref<boolean>(false)

// 刷新按钮点击回调
const updateRefresh = () => {
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
// 全屏按钮点击的回调
const fullScreen = () => {
  // DOM 对象的一个属性：可以用来判断当前是不是全部模式【全屏：true，不是全屏：false】
  let full = document.fullscreenElement
  // 切换为全屏模式
  if (!full) {
    // 利用文档的根结点方法 requestFullscreen 实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 变为不是全屏模式，退出全屏模式
    document.exitFullscreen()
  }
}

// 退出登录点击回调
const logout = async () => {
  // 第一件事情：需要像服务器发请求【退出登录接口】
  // 第二件事情：仓库当中关于用户相关的数据青口[token|username|avatar]
  // 第三件事情：跳转到登录页面
  await userStore.userLogout()
  // 跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

// 颜色组件数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

// 暗黑模式切换
const changeDark = () => {
  // 获取 HTML 根节点
  let html = document.documentElement
  // 判断HTML标间是否有类名dark
  dark.value ? (html.className = 'dark') : (html.className = '')
}

// 主题颜色设置
const setColor = () => {
  // 通过js修改根节点的样式属性与属性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>
<style scoped></style>
