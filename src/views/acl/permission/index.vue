<template>
  <div>
    <el-table :data="PermissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <!-- row：即为已有的菜单对象｜按钮对象的数据 -->
        <template v-slot="{ row }">
          <el-button
            type="primary"
            size="small"
            :disabled="row.level == 4 ? true : false"
            @click="addPermission(row)"
          >
            {{ row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="row.level == 1 ? true : false"
            @click="updatePermission(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`确定删除${row.name}？`"
            width="260px"
            @confirm="removeMenu(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框组件：添加或者跟新已有菜单数据结构 -->
    <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'" width="500">
      <!-- 表单组件：收集新增与已有菜单数据 -->
      <el-form>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input placeholder="请输入菜单名称" v-model="menuData.name"></el-input>
        </el-form-item>
        <el-form-item label="权限值" :label-width="formLabelWidth">
          <el-input placeholder="请输入权限值" v-model="menuData.code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="Permission">
import { ref, onMounted, reactive } from 'vue'
// 引入获取菜单请求API
import { reqAddOrUpdateMenu, reqAllPermisson, reqRemoveMenu } from '@/api/acl/menu'
import type {
  MenuParams,
  Permission,
  PermissionList,
  PermissionResponsData,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

// 存储菜单数据
let PermissionArr = ref<PermissionList>([])
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 携带的参数
let menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})
// form label 宽度
const formLabelWidth = '80px'

// 组件挂载完毕
onMounted(() => {
  getHashPermission()
})

// 获取菜单数据方法
const getHashPermission = async () => {
  const result: PermissionResponsData = await reqAllPermisson()
  if (result.code == 200) {
    PermissionArr.value = result.data
  }
}

// 添加菜单按钮回调
const addPermission = (row: Permission) => {
  // 清空数据
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  // 对话框显示出来
  dialogVisible.value = true
  // 收集新增菜单的level数值
  menuData.level = row.level + 1
  // 新增的子菜单
  menuData.pid = row.id
}

// 编辑已有菜单
const updatePermission = (row: Permission) => {
  // 收集已有菜单数据
  Object.assign(menuData, row)
  // 显示对话框
  dialogVisible.value = true
}

// 确定按钮回调
const save = async () => {
  // 新增子菜单或更新菜单
  let result: any = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    // 对话框隐藏
    dialogVisible.value = false
    // 提示信息
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功',
    })
    // 再次获取全部最新的菜单数据
    getHashPermission()
  }
}

// 删除菜单
const removeMenu = async (id: number) => {
  const result: any = await reqRemoveMenu(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHashPermission()
  }
}
</script>
<style scoped></style>
