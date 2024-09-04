<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script lang="ts" setup name="Bradcrumb">
import useLayOutSettingStore from '@/store/modules/tabbar'
// 获取layout配置相关的仓库
const LayOutSettingStore = useLayOutSettingStore()
// 点击图标的方法
const changeIcon = () => {
  // 图标进行切换
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>
<style scoped></style>
