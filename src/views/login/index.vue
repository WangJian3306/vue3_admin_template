<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item>
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup name="Home">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
// 引入用户相关小仓库
import useUserStore from '@/store/modules/user'
// 获取仓库
let userStore = useUserStore()

// 获取路由器
let $router = useRouter()

// 收集账号与密码数据
let loginForm = reactive({ username: 'admin', password: '111111' })

// 定义变量控制按钮加载效果
let loading = ref(false)

// 登录按钮回调
const login = async () => {
  // 加载效果：开始加载
  loading.value = true
  // 点击登录按钮以后干什么？
  // 通知仓库发登录请求
  // 请求成功->首页展示数据
  // 请求失败->登录失败提示
  try {
    // 保证登录成功
    await userStore.userLogin(loginForm)
    // 编程式导航跳转到展示数据首页
    $router.push('/')
    // 登录成功提示信息
    ElNotification({
      type: 'success',
      message: '登录成功',
    })
    // 登录成功加载效果也关闭
    loading.value = false
  } catch (error) {
    // 关闭加载效果
    loading.value = false
    // 登录失败的提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg'), no-repeat;
  background-size: cover;
}
.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url('@/assets/images/login_form.png'), no-repeat;
  background-size: cover;
  padding: 40px;
  h1 {
    color: white;
    font-size: 40px;
  }
  h2 {
    font-size: 20px;
    color: white;
    margin: 20px 0;
  }
}
.login_btn {
  width: 100%;
}
</style>
