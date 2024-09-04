<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
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
const logout = () => {
  // 第一件事情：需要像服务器发请求【退出登录接口】
  // 第二件事情：仓库当中关于用户相关的数据青口[token|username|avatar]
  // 第三件事情：跳转到登录页面
  userStore.userLogout()
  // 跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>
<style scoped></style>
