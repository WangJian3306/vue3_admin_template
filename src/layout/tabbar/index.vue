<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <!-- 左侧面包屑  -->
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>
<script lang="ts" setup name="Tabbar">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>
<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  // background-image: linear-gradient(
  //   to right,
  //   rgb(232, 223, 223),
  //   rgb(202, 178, 178),
  //   rgb(197, 165, 165)
  // );
  border-bottom: solid 1px;

  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }

  .tabbar_right {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
}
</style>
