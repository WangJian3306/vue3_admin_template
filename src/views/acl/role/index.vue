<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="角色搜索">
        <el-input placeholder="请输入搜索角色名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default">搜索</el-button>
        <el-button type="primary" size="default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" icon="Plus">添加角色</el-button>
    <el-table border style="margin: 10px 0px">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column align="center" label="id"></el-table-column>
      <el-table-column align="center" label="角色名称" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="创建时间" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="更新时间" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="操作" width="260px"></el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout=" prev, pager, next, jumper, ->, sizes, total,"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>
<script lang="ts" setup name="Role">
import { ref } from 'vue'
// 当前页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(10)
</script>
<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
