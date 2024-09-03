<template>
  <div>
    <h1>App根组件</h1>
  </div>
</template>
<script lang="ts" setup name="App">
import { onMounted } from 'vue'
import { reqLogin } from './api/user'
onMounted(() => {
  reqLogin({ username: 'admin', password: '111111' }).then((value) => {
    console.log(value)
  })
})
</script>
<style scoped></style>
