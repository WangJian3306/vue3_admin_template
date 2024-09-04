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
        <el-menu-item
          v-if="!item.children[0].meta.hidden"
          :index="item.children[0].path"
          @click="goRoute"
        >
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
// 获取路由器对象
import { useRouter } from 'vue-router'
const $router = useRouter()
// 点击菜单的回调
import type { MenuItemRegistered } from 'element-plus'
const goRoute = (vc: MenuItemRegistered) => {
  // 路由跳转
  $router.push(vc.index)
  // console.log(vc.index)
}
</script>
<style scoped></style>
