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
    <el-table border style="margin: 10px 0" :data="trademarkArr">
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <!-- el-table-column 默认展示数据用的是 div -->
      <el-table-column label="品牌名称" align="center">
        <template v-slot="{ row }">
          <pre style="color: red">{{ row.tmName }}</pre>
        </template>
      </el-table-column>
      <el-table-column label="品牌LOGO" align="center">
        <template v-slot="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot>
          <el-button type="primary" size="small" icon="Edit"></el-button>
          <el-button type="primary" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
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
      :total="total"
    />
  </el-card>
</template>
<script lang="ts" setup name="Tradmark">
import { ref, onMounted } from 'vue'
import type { ComponentSize } from 'element-plus'
import { reqHasTrademark } from '@/api/product/trademark'
import type { Records, TradeMarkResponseData } from '@/api/product/trademark/type'

// 当前页码
let pageNo = ref<number>(1)
// 每页展示数据的条数
let limit = ref<number>(3)
// 分页器大小
const size = ref<ComponentSize>('default')
// 存储已有品牌数据总数
let total = ref<number>(0)
// 存储已有品牌的数据
let trademarkArr = ref<Records>([])

// 获取已有品牌的接口封装维一个函数：在任何情况下获取数据，调用此函数即可
const getHasTrademark = async () => {
  const result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code == 200) {
    // 存储已有品牌总个数
    total.value = result.data.total

    trademarkArr.value = result.data.records
  }
}

// 组件挂载完毕，发送请求获取数据
onMounted(() => {
  getHasTrademark()
})
</script>
<style scoped></style>
