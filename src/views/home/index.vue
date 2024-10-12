<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="userStore.avatar" alt="" class="avatar" />
        <div class="bottom">
          <h3 class="title">{{ time }}好{{ userStore.username }}</h3>
          <p class="subtitle">硅谷甄选运营平台</p>
        </div>
      </div>
    </el-card>
    <div class="bottom2">
      <SvgIcon name="welcome" width="600px" height="500px"></SvgIcon>
    </div>
  </div>
</template>
<script lang="ts" setup name="Home">
import { getTime } from '@/utils/time'
// 引入用户相关仓库，获取当前登录用户的头像、昵称
import useUserStore from '@/store/modules/user'
// 获取存储用户信息的仓库对象
let userStore = useUserStore()

let time = getTime()
</script>
<style scoped lang="scss">
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;
    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 20px;
    }
    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}

.bottom2 {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
