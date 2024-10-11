<template>
  <div>
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="角色搜索">
          <el-input placeholder="请输入搜索角色名称" v-model="keyword"></el-input>
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
      <el-button type="primary" size="default" icon="Plus" @click="addRole">添加角色</el-button>
      <el-table border style="margin: 10px 0px" :data="allRole">
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column align="center" label="id" prop="id"></el-table-column>
        <el-table-column
          align="center"
          label="角色名称"
          show-overflow-tooltip
          prop="roleName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          show-overflow-tooltip
          prop="createTime"
        ></el-table-column>
        <el-table-column
          align="center"
          label="更新时间"
          show-overflow-tooltip
          prop="updateTime"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <!-- row：已有的角色对象 -->
          <template v-slot="{ row }">
            <el-button type="primary" size="small" icon="User">分配权限</el-button>
            <el-button type="primary" size="small" icon="User" @click="updateRole(row)">
              编辑
            </el-button>
            <el-button type="primary" size="small" icon="User">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout=" prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="getHasRole"
      />
    </el-card>
    <!-- 添加角色与更新已有角色 -->
    <el-dialog v-model="dialogVisite" :title="roleParams.id ? '更新角色' : '添加角色'">
      <el-form :model="roleParams" :rules="rules" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="roleParams.roleName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="default" @click="dialogVisite = false">取消</el-button>
        <el-button type="primary" size="default" @click="save">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="Role">
import { reqAddOrUpdateRole, reqAllRoleList } from '@/api/acl/role'
import type { Records, RoleData, RoleResponseData } from '@/api/acl/role/type'
import { ElMessage, FormInstance } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue'
// 当前页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(10)
// 角色搜索关键字
let keyword = ref<string>('')
// 存储全部已有角色
let allRole = ref<Records>([])
// 角色总个数
let total = ref<number>(0)
// 控制对话框的显示与隐藏
let dialogVisite = ref<boolean>(false)
// 收集角色数据
let roleParams = reactive<RoleData>({
  roleName: '',
})
// 获取form组件实例
let form = ref<FormInstance>()

// 组件挂载完毕
onMounted(() => {
  // 获取角色请求
  getHasRole()
})

// 获取已有角色｜分页器页码发生变化的回调
const getHasRole = async (pager = 1) => {
  // 修改当前页码
  pageNo.value = pager
  const result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}

// 下拉菜单的回调
const handleSizeChange = () => {
  getHasRole()
}

// 搜索
const search = () => {
  getHasRole()
  keyword.value = ''
}

// 重置(和老师的实现方法不一样，这种方式更简洁)
const reset = () => {
  keyword.value = ''
  getHasRole()
}

// 添加角色
const addRole = () => {
  dialogVisite.value = true
  // 清空数据
  Object.assign(roleParams, {
    id: 0,
    roleName: '',
  })
  // 清空上一次表单校验结果
  nextTick(() => {
    form.value?.clearValidate('roleName')
  })
}

// 更新角色
const updateRole = (row: RoleData) => {
  dialogVisite.value = true
  // 存储已有角色数据（带有ID的）
  Object.assign(roleParams, row)
  // 清空上一次表单校验结果
  nextTick(() => {
    form.value?.clearValidate('roleName')
  })
}
// 自定义校验规则
const validatorRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('角色名称至少两位'))
  }
}
// 角色名称校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}

// 确定按钮回调
const save = async () => {
  // 表单校验结果，结果通过再发请求，结果没有通过不发请求
  await form.value?.validate()
  // 添加或更新角色
  let result = await reqAddOrUpdateRole(roleParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: roleParams.id ? '更新成功' : '添加成功',
    })
    getHasRole(roleParams.id ? pageNo.value : 1)
    dialogVisite.value = false
  }
}
</script>
<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
