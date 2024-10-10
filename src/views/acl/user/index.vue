<template>
  <div>
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名：">
          <el-input placeholder="请输入搜索用户名" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="default"
            :disabled="keyword ? false : true"
            @click="search"
          >
            搜索
          </el-button>
          <el-button type="primary" size="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
      <el-button
        type="primary"
        size="default"
        :disabled="selectIdArr.length ? false : true"
        @click="deleteSelectUser"
      >
        批量删除
      </el-button>
      <!-- table 展示用户信息 -->
      <el-table @selection-change="selectChange" style="margin: 10px 0px" border :data="userArr">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="#" align="center" type="index"></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column
          label="用户名字"
          align="center"
          prop="username"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户名称"
          align="center"
          prop="name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户角色"
          align="center"
          prop="roleName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template v-slot="{ row }">
            <el-button type="primary" size="small" icon="User" @click="setRole(row)">
              分配角色
            </el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定删除${row.username}？`"
              width="260px"
              @confirm="deleteUser(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[5, 7, 9, 11]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="getHasUser"
      />
    </el-card>
    <!-- 抽屉结构：完成添加新的用户账号｜更新已有的账号信息 -->
    <el-drawer v-model="drawer" direction="rtl">
      <!-- 头部标题：文字内容是动态的 -->
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <!-- 主体部分 -->
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input placeholder="请输入用户姓名" v-model="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉结构：用于某一个已有的账号进行职位分配 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="角色列表">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <!-- 显示角色复选框 -->
            <el-checkbox-group v-model="checkedRole" @change="handleCheckedRoleChange">
              <el-checkbox v-for="(role, index) in allRole" :key="index" :value="role">
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup name="User">
import useLayOutSettingStore from '@/store/modules/tabbar'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqAddOrUpdateUser,
  reqAllRole,
  reqRemoveBatchUser,
  reqRemoveUser,
  reqSetUserRole,
  reqUserList,
} from '@/api/acl/user'
import type {
  AllRole,
  AllRoleResponseData,
  Records,
  SetRoleData,
  User,
  UserResponseData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
// 默认页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(5)
// 存储全部用户的数组
let userArr = ref<Records>([])
// 用户总个数
let total = ref<number>(0)
// 抽屉显示与隐藏
let drawer = ref<boolean>(false)
// 收集用户信息数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
// 获取 form 组件实例
let formRef = ref<any>()
// 控制分配角色抽屉显示与隐藏
let drawer1 = ref<boolean>(false)
// 存储全部角色数据
let allRole = ref<AllRole>([])
// 用户已有角色数据
let checkedRole = ref<AllRole>([])
// 是否全选
let checkAll = ref<boolean>(false)
// 设置复选框不确定状态，仅负责样式控制
const isIndeterminate = ref<boolean>(true)
// 存储批量删除用户的ID
let selectIdArr = ref<User[]>([])
// 收集用户输入关键字
let keyword = ref<string>('')
// 获取tabber小仓库
let settingStore = useLayOutSettingStore()

// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  //收集当前的页码
  pageNo.value = pager
  const result: UserResponseData = await reqUserList(pageNo.value, pageSize.value, keyword.value)
  if (result.code === 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

// 分页器下拉菜单自定义事件回调
const handleSizeChange = () => {
  getHasUser()
}

// 添加用户按钮的回调
const addUser = () => {
  // 显示抽屉
  drawer.value = true
  // 清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })

  // 清除上一次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

// 更新已有的用户按钮回调
// row即为已有的用户信息
const updateUser = (row: User) => {
  drawer.value = true
  // 收集已有的账号信息
  Object.assign(userParams, row)

  // 清除上一次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

// 保存按钮回调
const save = async () => {
  // form 表单校验
  await formRef.value.validate()

  // 确定按钮：添加新的用户或者更新已有的账号信息
  const result: any = await reqAddOrUpdateUser(userParams)
  // 添加或者更新成功
  if (result.code === 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })

    // 获取最新全部账号信息
    // getHasUser(userParams.id ? pageNo.value : 1)

    // 浏览器自动刷新一次
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}

// 取消按钮回调
const cancel = () => {
  drawer.value = false
}

// 校验用户名字回调函数
const validatorUsername = (rule: any, value: any, callBack: any) => {
  // 用户名字｜昵称，长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}

// 校验用户名字回调函数
const validatorName = (rule: any, value: any, callBack: any) => {
  // 用户名字｜昵称，长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}

// 校验用户名字回调函数
const validatorPassword = (rule: any, value: any, callBack: any) => {
  // 用户名字｜昵称，长度至少五位
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}

// 表单校验的规则对象
const rules = {
  // 用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  // 用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  // 用户密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

// 分配角色按钮回调
const setRole = async (row: User) => {
  // 存储用户信息
  Object.assign(userParams, row)
  // 获取角色信息
  const result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code == 200) {
    // 全部角色
    allRole.value = result.data.allRolesList
    // 已有角色
    checkedRole.value = result.data.assignRoles
    // 显示抽屉
    drawer1.value = true
    // 全选复选框状态
    checkAll.value = allRole.value.length == checkedRole.value.length
    isIndeterminate.value =
      checkedRole.value.length > 0 && checkedRole.value.length < allRole.value.length
  }
}

// 全选复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  checkedRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
// 底部复选框change事件
const handleCheckedRoleChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

// 分配角色确定按钮回调
const confirmClick = async () => {
  // 收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: checkedRole.value.map((item) => {
      return item.id as number
    }),
  }
  const result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配角色成功',
    })
    drawer1.value = false
    // 获取更新完毕用户信息，根系完毕留在当前页
    getHasUser(pageNo.value)
  }
}

// 删除某一账号
const deleteUser = async (userId: number) => {
  const result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasUser(userArr.value.length > 0 ? pageNo.value : pageNo.value - 1)
  }
}

// table 复选框勾选触发事件
const selectChange = (value: any) => {
  selectIdArr.value = value
}

// 批量删除按钮回调
const deleteSelectUser = async () => {
  // 整理批量删除的参数
  const idsList: number[] = selectIdArr.value.map((item) => {
    return item.id as number
  })

  // 批量删除
  const result: any = await reqRemoveBatchUser(idsList)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasUser(userArr.value.length > 0 ? pageNo.value : pageNo.value - 1)
  }
}

// 搜索按钮的回调
const search = () => {
  // 根据关键字获取响应的用户数据
  getHasUser()
  // 清空关键字
  keyword.value = ''
}

// 重置按钮
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

onMounted(() => {
  getHasUser()
})
</script>
<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
