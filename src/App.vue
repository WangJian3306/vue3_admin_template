<template>
  <div>
    <h1>App根组件</h1>
    <h1>新增一个标题</h1>
  </div>
</template>
<script lang="ts" setup name="App">
for (let i = 0; i < 100; i++) {
  console.log(i)
}
</script>
<style scoped>
.box {
  width: 600px;
  height: 400px;
  background: black;
  h1 {
    color: white;
  }
}
</style>
