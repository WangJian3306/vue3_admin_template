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
            @click="addPermission"
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
          <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框组件：添加或者跟新已有菜单数据结构 -->
    <el-dialog v-model="dialogVisible" title="添加菜单" width="500" :before-close="handleClose">
      <!-- 表单组件：收集新增与已有菜单数据 -->
      <el-form>
        <el-form-item label="名称">
          <el-input placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="权限值">
          <el-input placeholder="请输入权限值"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="Permission">
import { ref, onMounted } from 'vue'
// 引入获取菜单请求API
import { reqAllPermisson } from '@/api/acl/menu'
import type { Permission, PermissionList, PermissionResponsData } from '@/api/acl/menu/type'

// 存储菜单数据
let PermissionArr = ref<PermissionList>([])
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)

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
const addPermission = () => {
  // 对话框显示出来
  dialogVisible.value = true
}

// 编辑已有菜单
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
}
</script>
<style scoped></style>
