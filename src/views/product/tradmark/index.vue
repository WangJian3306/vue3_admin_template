<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加按钮 -->
    <el-button type="primary" size="default" icon="Plus">添加品牌</el-button>
    <!-- 表格组件，展示数据 -->
    <!-- 
      table
      ---border：可以设置表格纵向是否有边框
      table-column
      ---label: 某一列的表头
      ---width：这一这列的宽度
      ---align：这一列文本对其方式
     -->
    <el-table border style="margin: 10px 0">
      <el-table-column label="序号" width="80px" align="center"></el-table-column>
      <el-table-column label="品牌名称" align="center"></el-table-column>
      <el-table-column label="品牌LOGO" align="center"></el-table-column>
      <el-table-column label="操作" align="center"></el-table-column>
    </el-table>
    <!-- 分页器组件
      pagination
        v-model:currentPage：设置分页器当前页码
        v-model:page-size：每页展示数据的条数
        page-sizes：用于设置下拉菜单的数据
        size：分页器大小
        background：设置分页器按钮背景颜色
        layout：可以设置分页器六个子组件布局调整
    -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :size="size"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="400"
    />
  </el-card>
</template>
<script lang="ts" setup name="Tradmark">
import { ref } from 'vue'
import type { ComponentSize } from 'element-plus'

// 当前页码
let pageNo = ref<number>(1)
// 每页展示数据的条数
let limit = ref<number>(3)
// 分页器大小
const size = ref<ComponentSize>('default')
</script>
<style scoped></style>
