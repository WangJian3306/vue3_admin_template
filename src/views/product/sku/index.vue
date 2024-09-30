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
          <el-button type="primary" size="small" icon="InfoFilled" @click="findSku"></el-button>
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
    <!-- 抽屉组件：展示商品详情 -->
    <el-drawer v-model="drawer">
      <!-- 标题部分 -->
      <template #header>
        <h4>查看商品的详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">华为MateXT</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">华为YYDS</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">6999</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in 10" :key="item" style="margin: 5px 5px">{{ item }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in 10" :key="item" style="margin: 5px 5px">{{ item }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in 6" :key="item">
                <h3 text="2xl" justify="center">{{ item }}</h3>
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
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

// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)

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

// 查看商品详情按钮的回调
const findSku = () => {
  drawer.value = true
}
</script>
<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
