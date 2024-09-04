<template>
  <div>
    <template v-for="item in menuList" :key="item.path">
      <!-- 无子菜单 -->
      <template v-if="!item.children">
        <el-menu-item v-if="!item.meta.hidden" :index="item.path" @click="goRoute">
          <template #title>
            <el-icon>
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 只有一个子菜单 -->
      <template v-if="item.children && item.children.length == 1">
        <el-menu-item v-if="!item.children[0].meta.hidden" :index="item.children[0].path">
          <template #title>
            <el-icon>
              <component :is="item.children[0].meta.icon"></component>
            </el-icon>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 两个及以上的子菜单 -->
      <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.path">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
    </template>
  </div>
</template>
<script lang="ts" setup name="Menu">
// 获取父组件传递过来的全部路由数组
defineProps(['menuList'])
// 点击菜单的回调
const goRoute = (vc: any) => {
  console.log(vc.path)
}
</script>
<style scoped></style>
