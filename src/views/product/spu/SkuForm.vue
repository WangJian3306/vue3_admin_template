<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number"></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input placeholder="重量(g)"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input placeholder="SKU描述" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline="true">
        <el-form-item v-for="item in attrArr" :key="item.id" :label="item.attrName">
          <el-select style="width: 240px">
            <el-option
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline="true">
        <el-form-item v-for="item in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select style="width: 240px">
            <el-option
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片" align="center">
          <template v-slot="{ row }">
            <el-image style="width: 100px; height: 100px" :src="row.imgUrl" fit="fill" />
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" prop="imgName"></el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template v-slot="{ row }">
            <el-button type="primary" size="small">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup name="SkuForm">
import type {
  SaleAttr,
  SaleAttrResponseData,
  SpuData,
  SpuHasImg,
  SpuImg,
} from '@/api/product/spu/type'
import { ref } from 'vue'

// 平台属性
let attrArr = ref<AttrList>([])
// 销售属性
let saleArr = ref<SaleAttr[]>([])
// 照片墙
let imgArr = ref<SpuImg[]>([])

// 取消按钮回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}
// 自定义事件的方法
let $emit = defineEmits(['changeScene'])

// 引入请求API
import { reqAttr } from '@/api/product/attr'
import { reqSpuHasSaleAttr, reqSpuImageList } from '@/api/product/spu'
import type { AttrList, AttrResponseData } from '@/api/product/attr/type'

// 当前子组件的方法对外暴露
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: SpuData) => {
  console.log('获取平台属性')
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

defineExpose({
  initSkuData,
})
</script>
<style scoped></style>
