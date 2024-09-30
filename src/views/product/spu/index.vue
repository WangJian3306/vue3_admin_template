<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px">
      <!-- v-if 与 v-show 都可以实现显示与隐藏 -->
      <div v-show="scene === 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作">
            <!-- row:即为已有的SPU对象 -->
            <template v-slot="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="getSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定删除 ${row.spuName} ?`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        ></el-pagination>
      </div>
      <!-- 添加SPU|修改SPU子组件 -->
      <SpuForm ref="spu" v-show="scene === 1" @changeScene="changeScene"></SpuForm>
      <!-- 添加SKU的子组件 -->
      <SkuForm ref="sku" v-show="scene === 2" @changeScene="changeScene"></SkuForm>

      <!-- dialog对话框：展示已有的SKU数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table :data="skuArr" border>
          <el-table-column label="SKU 名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU 价格" prop="price"></el-table-column>
          <el-table-column label="SKU 重量" prop="weight"></el-table-column>
          <el-table-column label="SKU 图片">
            <template v-slot="{ row }">
              <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>
<script lang="ts" setup name="Spu">
// 引入子组件
import SpuForm from './SpuForm.vue'
import SkuForm from './SkuForm.vue'
import { ref, watch } from 'vue'
import { reqHasSpu, reqRemoveSpu, reqSkuList } from '@/api/product/spu'
import {
  type Records,
  type HasSpuResponseData,
  type SpuData,
  type SkuInfoData,
  type SkuData,
} from '@/api/product/spu/type'
// 引入分类的仓库
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()

// 场景的数据
let scene = ref<number>(0) // 0 显示已有SPU 1 添加或者修改SPU 2 添加SKU
// 分页器默认页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(3)
// 存储已有的SPU的数据
let records = ref<Records>([])
// 存储已有SPU总个数
let total = ref<number>(0)
// 获取子组件实例SpuForm
let spu = ref<any>()
// 获取子组件实例SkuForm
let sku = ref<any>()
// 存储全部SKU数据
let skuArr = ref<SkuData[]>([])
// 控制 dialog 显示与隐藏
let show = ref<boolean>(false)

// 监听三级分裂ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 务必保证有三级分类ID
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)

// 此方法执行可以获取某一个三级分类下的全部已有的SPU
const getHasSpu = async (pager = 1) => {
  // 修改当前的页码
  pageNo.value = pager
  const result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code === 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

// 分页器下拉菜单发生变化的时候出发
const changeSize = () => {
  getHasSpu()
}

// 添加新的SPU按钮回调
const addSpu = () => {
  // 切换为场景1：添加与修改已有SPU结构->SpuForm
  scene.value = 1
  // 点击添加SPU按钮，调用子组件的方法初始化数据
  spu.value.initAddSpu(categoryStore.c3Id)
}

// 子组件SpuForm绑定自定义事件：目前是让子组件通知父组件切换场景为 0
const changeScene = (obj: any) => {
  // 子组件SpuForm点击取消变为场景 0
  scene.value = obj.flag
  if (obj.params === 'add') {
    // 添加跳转第一页
    getHasSpu()
  } else {
    // 更新留在当前页码
    getHasSpu(pageNo.value)
  }
}

// 修改SPU
const updateSpu = (row: SpuData) => {
  scene.value = 1
  // 调用子组件实例方法获取完整已有SPU的数据
  spu.value.initHasSpuData(row)
}

// 添加SKU
const addSku = (row: SpuData) => {
  // 切换为场景2
  scene.value = 2
  // 调用子组件的方法初始化添加SKU的数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 展示 SKU
const getSku = async (row: SpuData) => {
  const result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code === 200) {
    skuArr.value = result.data
    // 显示对话框
    show.value = true
  }
}

// 删除SPU
const deleteSpu = async (row: SpuData) => {
  const result: any = await reqRemoveSpu(row.id as number)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 获取一次已有的SPU
    getHasSpu(records.value.length > 0 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>
<style scoped></style>
