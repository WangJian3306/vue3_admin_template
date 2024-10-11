<template>
  <div>
    <el-table :data="PermissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="权限值" prop="code"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作">
        <!-- row：即为已有的菜单对象｜按钮对象的数据 -->
        <template v-slot="{ row }">
          <el-button type="primary" size="small" :disabled="row.level == 4 ? true : false">
            {{ row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false">
            编辑
          </el-button>
          <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup name="Permission">
import { ref, onMounted } from 'vue'
// 引入获取菜单请求API
import { reqAllPermisson } from '@/api/acl/menu'
import type { PermissionList, PermissionResponsData } from '@/api/acl/menu/type'

// 存储菜单数据
let PermissionArr = ref<PermissionList>([])

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
</script>
<style scoped></style>
