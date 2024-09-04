<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包屑动态展示路由名字与标题 -->
    <el-breadcrumb-item
      v-for="(item, index) in $router.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!-- 图标 -->
      <el-icon style="vertical-align: top">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑展示匹配路由的标题 -->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script lang="ts" setup name="Bradcrumb">
import { useRoute } from 'vue-router'
import useLayOutSettingStore from '@/store/modules/tabbar'
// 获取layout配置相关的仓库
const LayOutSettingStore = useLayOutSettingStore()
// 获取路由对象
const $router = useRoute()
// 点击图标的方法
const changeIcon = () => {
  // 图标进行切换
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>
<style scoped></style>
