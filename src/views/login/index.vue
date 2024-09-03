<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" ref="userFormRef" :model="loginForm" :rules="rules">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username" />
          </el-form-item>
          <el-form-item prop="password">
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
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
// 引入获取当前时间的函数
import { getTime } from '@/utils/time'
// 引入用户相关小仓库
import useUserStore from '@/store/modules/user'
// 获取仓库
let userStore = useUserStore()

// 获取路由器
let $router = useRouter()

// 获取el-form组件
const userFormRef = ref<FormInstance>()

// 收集账号与密码数据
interface LoginForm {
  username: string
  password: string
}
const loginForm = reactive<LoginForm>({ username: 'admin', password: '111111' })

// 定义变量控制按钮加载效果
let loading = ref(false)

// 自定义校验规则
const validatorUsername = (rule: any, value: any, callback: any) => {
  // rule:即为校验规则对象
  // value:即为表单元素的文本内容
  // 函数：如果符合条件 callBack 放行通过即可
  // 如果不符合条件，调用 callBack 方法，注入错误的提示信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少 5 位'))
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  // rule:即为校验规则对象
  // value:即为表单元素的文本内容
  // 函数：如果符合条件 callBack 放行通过即可
  // 如果不符合条件，调用 callBack 方法，注入错误的提示信息
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少 6 位'))
  }
}

// 表单表单字段校验规则
const rules = reactive<FormRules<LoginForm>>({
  // 规则对象属性：
  // required：代表这个四段是必须要填的
  // min: 文本长度至少多少位
  // max: 文本长度最多多少位
  // message：错误的提示信息
  // trigger：触发校验表单的是时机，change：文本发生变化时，blur：输入框失去焦点时
  username: [
    { required: true, message: '用户名必填' },
    // { min: 5, max: 10, message: '用户名长度需要在 5 到 10 之间', trigger: 'change' },
    { trigger: 'change', validator: validatorUsername },
  ],
  password: [
    { required: true, message: '密码必填' },
    // { min: 5, max: 15, message: '密码长度需要在 5 到 15 之间', trigger: 'change' },
    { trigger: 'change', validator: validatorPassword },
  ],
})

// 登录按钮回调
const login = async () => {
  // 保证表单校验通过再发送请求
  await userFormRef.value?.validate()

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
      message: '欢迎回来',
      title: `Hi, ${getTime()}好`,
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
