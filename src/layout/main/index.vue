<template>
  <div>
    <!-- 路由组件出口的位置 -->
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <!-- 渲染layout一级路由组件的子路由 -->
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts" setup name="Main"></script>
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
