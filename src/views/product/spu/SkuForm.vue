<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input placeholder="重量(g)" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="item in attrArr" :key="item.id" :label="item.attrName">
          <el-select style="width: 240px" v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="item in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select style="width: 240px" v-model="item.saleIdAndValueId">
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片" align="center">
          <template v-slot="{ row }">
            <el-image style="width: 100px; height: 100px" :src="row.imgUrl" fit="fill" />
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="imgName"></el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template v-slot="{ row }">
            <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup name="SkuForm">
import type {
  SaleAttrResponseData,
  SkuAttr,
  SkuData,
  SkuSaleAttr,
  SpuData,
  SpuHasImg,
  SpuImg,
} from '@/api/product/spu/type'
import { reactive, ref } from 'vue'
// 引入请求API
import { reqAttr } from '@/api/product/attr'
import { reqSpuHasSaleAttr, reqSpuImageList, reqAddSku } from '@/api/product/spu'
import type { AttrResponseData } from '@/api/product/attr/type'
import { ElMessage, type TableInstance } from 'element-plus'

// 平台属性
let attrArr = ref<SkuAttr[]>([])
// 销售属性
let saleArr = ref<SkuSaleAttr[]>([])
// 照片墙
let imgArr = ref<SpuImg[]>([])
// 获取 table 组件实例
let table = ref<TableInstance>()

// 收集SKU的参数
let skuParams = reactive<SkuData>({
  // 父组件传递的数据
  category3Id: '', // 三级分类的ID
  spuId: '', // 已有的SPU的ID
  tmId: '', // SPU 品牌ID
  // v-model 收集
  skuName: '', // SKU 名字
  price: '', // SKU 价格
  weight: '', // SKU 重量
  skuDesc: '', // SKU 描述
  skuAttrValueList: [], // 平台属性
  skuSaleAttrValueList: [
    // 销售属性
    {
      saleAttrId: '', // 销售属性ID
      saleAttrValueId: '', // 销售属性值ID
    },
  ],
  skuDefaultImg: '', // 售卖SKU图片地址
})

// 取消按钮回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}
// 自定义事件的方法
let $emit = defineEmits(['changeScene'])

// 当前子组件的方法对外暴露
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: SpuData) => {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id as number
  skuParams.tmId = spu.tmId
  // 获取平台属性
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
  // 获取对应的销售属性
  let result1: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  if (result1.code === 200) {
    saleArr.value = result1.data
  }
  // 获取照片墙的数据
  let result2: SpuHasImg = await reqSpuImageList(spu.id as number)
  if (result2.code === 200) {
    imgArr.value = result2.data
  }
}

// 设置默认图片的方法回调
const handler = (row: SpuImg) => {
  // 点击的时候，全部的复选框不勾选
  table.value?.clearSelection()
  // 勾选选中的行
  table.value?.toggleRowSelection(row, true)
  // 收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}

// 保存按钮方法
const save = async () => {
  // 整理参数
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  }, [])
  // 销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId,
      })
    }
    return prev
  }, [])

  // 发请求
  const result = await reqAddSku(skuParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功',
    })

    // 通知父组件切换场景为0
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败',
    })
  }

  //
}

// 对外暴露方法
defineExpose({
  initSkuData,
})
</script>
<style scoped></style>
