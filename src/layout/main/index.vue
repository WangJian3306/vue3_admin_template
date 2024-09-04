<template>
  <div>
    <!-- 路由组件出口的位置 -->
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <!-- 渲染layout一级路由组件的子路由 -->
        <component :is="Component" v-if="flag" />
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts" setup name="Main">
import { watch, ref, nextTick } from 'vue'
import useLayOutSettingStore from '@/store/modules/tabbar'
const LayOutSettingStore = useLayOutSettingStore()
// 控制当前组件是否销毁重建
const flag = ref(true)
// 监听仓库内部数据是否发生变化，如果发生变化，说明用户点击过刷新按钮
watch(
  () => LayOutSettingStore.refresh,
  () => {
    // 点击刷新按钮；路由组件销毁
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>
<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
