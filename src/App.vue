<template>
  <div>
    <h1>测试axios二次封装</h1>
  </div>
</template>
<script lang="ts" setup name="App">
import request from '@/utils/request'
import { onMounted } from 'vue'

// 当组件挂载完毕，发送请求
onMounted(() => {
  request({
    url: '/user/login',
    method: 'post',
    data: {
      username: 'admin',
      password: '111111',
    },
  }).then((res) => {
    console.log(res)
  })
})
</script>
<style scoped lang="scss"></style>
