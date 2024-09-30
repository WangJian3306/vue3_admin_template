<template>
  <el-card>
    <el-table border style="margin: 10px 0px">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="150px"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip></el-table-column>
      <el-table-column label="默认图片" width="150px"></el-table-column>
      <el-table-column label="重量" width="150px"></el-table-column>
      <el-table-column label="价格" width="150px"></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right"></el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total "
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>
<script lang="ts" setup name="SKU">
import { ref } from 'vue'
// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(10)
</script>
<style scoped></style>
