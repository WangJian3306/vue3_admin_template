<template>
  <el-card>
    <el-table border style="margin: 10px 0px" :data="skuArr">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        width="150px"
        prop="skuName"
      ></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="150px">
        <template v-slot="{ row }">
          <img :src="row.skuDefaultImg" alt="" style="height: 100px; width: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="重量" width="150px" prop="weight"></el-table-column>
      <el-table-column label="价格" width="150px" prop="price"></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            size="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateSku"></el-button>
          <el-button type="primary" size="small" icon="InfoFilled"></el-button>
          <el-button type="primary" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total "
      :total="total"
      @size-change="handleSizeChange"
      @current-change="getHasSku"
    />
  </el-card>
</template>
<script lang="ts" setup name="SKU">
import { ref, onMounted } from 'vue'
// 引入请求方法
import { reqCancelSale, reqSaleSku, reqSkuList } from '@/api/product/sku'
import type { SkuData, SkuResponseData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])

// 组件挂载完毕
onMounted(() => {
  getHasSku()
})

// 获取已有SKU
const getHasSku = async (pager = 1) => {
  // 当前分页器的页码
  pageNo.value = pager
  const result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code === 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}

// 分页器下拉菜单发生变化触发
const handleSizeChange = () => {
  getHasSku()
}

// 商品的上架与下架
const updateSale = async (row: SkuData) => {
  // 如果当前商品的 isSale === 1，说明当前商品是上架的状态 -> 更新为下架
  // 否则else的情况与上门情况相反
  if (row.isSale === 1) {
    const result = await reqCancelSale(row.id)
    if (result.code === 200) {
      ElMessage({
        type: 'success',
        message: '商品下架成功',
      })
    }
    // 发请求获取当前更新完毕的已有的SKU
    getHasSku(pageNo.value)
  } else {
    const result = await reqSaleSku(row.id)
    if (result.code === 200) {
      ElMessage({
        type: 'success',
        message: '商品上架成功',
      })
    }
    getHasSku(pageNo.value)
  }
}

// 更新已有SKU
const updateSku = () => {
  ElMessage({
    type: 'success',
    message: '程序员在努力的建设中...',
  })
}
</script>
<style scoped></style>
