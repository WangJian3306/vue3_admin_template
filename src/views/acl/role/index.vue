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
            <el-button type="primary" size="small" icon="User" @click="setPermission(row)">
              分配权限
            </el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">
              编辑
            </el-button>

            <el-popconfirm
              :title="`确定删除角色：${row.roleName}?`"
              width="260px"
              @confirm="removeRole(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
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
    <!-- 抽屉组件：分配角色的菜单权限与按钮权限 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配菜单与按钮权限</h4>
      </template>
      <template #default>
        <!-- 树形控件 -->
        <el-tree
          style="max-width: 600px"
          :data="menuArr"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="selectArr"
          :props="defaultProps"
          ref="tree"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup name="Role">
import {
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqAllRoleList,
  reqRemoveRole,
  reqSetPermission,
} from '@/api/acl/role'
import type {
  MenuList,
  MenuResponseData,
  Records,
  RoleData,
  RoleResponseData,
} from '@/api/acl/role/type'
import { ElMessage, type FormInstance, type TreeInstance } from 'element-plus'
import type { TreeKey } from 'element-plus/es/components/tree/src/tree.type.mjs'
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
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
// 存储用户权限数据
let menuArr = ref<MenuList>([])
// 存储勾选了节点的id
let selectArr = ref<number[]>([])
// 获取tree 组件实例
let tree = ref<TreeInstance>()

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

// 分配权限回调
// row 已有角色数据
const setPermission = async (row: RoleData) => {
  // 显示抽屉
  drawer.value = true
  // 收集当前要分配权限的角色数据
  Object.assign(roleParams, row)
  // 根据角色id获取权限数据
  const result: MenuResponseData = await reqAllMenuList(roleParams.id as number)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}

// 树形控件数据
const defaultProps = {
  children: 'children',
  label: 'name',
}

const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })

  return initArr
}

// 抽屉确定按钮回调
const confirmClick = async () => {
  // 角色ID
  const roleId = roleParams.id as number
  // 选中节点的ID
  let checkedKeys = tree.value?.getCheckedKeys()
  // 半选的id
  let halfCheckedKeys = tree.value?.getHalfCheckedKeys()
  let permissionId = checkedKeys?.concat(halfCheckedKeys as TreeKey[])
  // 下发权限
  const result = await reqSetPermission(roleId, permissionId as number[])
  if (result.code == 200) {
    // 抽屉关闭
    drawer.value = false
    ElMessage({
      type: 'success',
      message: '分配权限成功',
    })
    // getHasRole()
    // 页面刷新
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: '分配权限失败',
    })
  }
}

// 删除已有角色
const removeRole = async (roleId: number) => {
  const result = await reqRemoveRole(roleId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除角色成功',
    })
    getHasRole(allRole.value.length > 0 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除角色失败',
    })
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
