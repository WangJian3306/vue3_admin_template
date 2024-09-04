<template>
  <div>
    <h1>是一级路由，展示登录成功以后的数据，{{ userStore.username }}</h1>
  </div>
</template>
<script lang="ts" setup name="Home">
// 引入组合式API函数之生命周期函数
import { onMounted } from 'vue'
// 获取仓库
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
// 当前首页挂载完毕发请求获取用户信息
onMounted(() => {
  userStore.userInfo()
})
</script>
<style scoped></style>
