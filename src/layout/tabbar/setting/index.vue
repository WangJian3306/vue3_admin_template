<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <img src="../../../../public/logo.png" style="width: 24px; height: 24px; margin: 0 10px" />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      admin
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup name="Setting">
// 获取layout的小仓库
import useLayOutSettingStore from '@/store/modules/tabbar'
const LayOutSettingStore = useLayOutSettingStore()
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
</script>
<style scoped></style>
