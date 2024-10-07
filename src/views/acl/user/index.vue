<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名：">
        <el-input placeholder="请输入搜索用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default">搜索</el-button>
        <el-button type="primary" size="default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default">添加用户</el-button>
    <el-button type="primary" size="default">批量删除</el-button>
    <!-- table 展示用户信息 -->
    <el-table style="margin: 10px 0px" border :data="userArr">
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
          <el-button type="primary" size="small" icon="User">分配角色</el-button>
          <el-button type="primary" size="small" icon="Edit">编辑</el-button>
          <el-button type="primary" size="small" icon="Delete">删除</el-button>
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
</template>
<script lang="ts" setup name="User">
import { ref, onMounted } from 'vue'
import { reqUserList } from '@/api/acl/user'
import type { Records, UserResponseData } from '@/api/acl/user/type'
// 默认页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(5)
// 存储全部用户的数组
let userArr = ref<Records>([])
// 用户总个数
let total = ref<number>(0)
// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  //收集当前的页码
  pageNo.value = pager
  const result: UserResponseData = await reqUserList(pageNo.value, pageSize.value)
  console.log(result)
  if (result.code === 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

// 分页器下拉菜单自定义事件回调
const handleSizeChange = () => {
  getHasUser()
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
