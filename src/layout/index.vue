<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">123</div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar">456</div>
    <!-- 内容展示区域 -->
    <div class="layout_main">
      <p style="height: 10000px; background: red">我是一个段落</p>
    </div>
  </div>
</template>
<script lang="ts" setup name="Layout"></script>
<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  background: red;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
  }
  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background: cyan;
    top: 0px;
    left: $base-menu-width;
  }
  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background: yellowgreen;
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
  }
}
</style>
