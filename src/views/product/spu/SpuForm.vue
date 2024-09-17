<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select style="width: 240px">
        <el-option label="华为"></el-option>
        <el-option label="ooppo"></el-option>
        <el-option label="vivo"></el-option>
        <el-option label="小米"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请输入SPU描述"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="fileList"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性下拉菜单 -->
      <el-select style="width: 240px">
        <el-option label="华为"></el-option>
        <el-option label="小米"></el-option>
      </el-select>
      <el-button style="margin-left: 10px" type="primary" size="default" icon="Plus">
        添加属性值
      </el-button>
      <!-- table 展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0px">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名字" width="120px"></el-table-column>
        <el-table-column label="销售属性值"></el-table-column>
        <el-table-column label="销售属性值" width="120px"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup name="SpuForm">
import type {
  AllTradeMark,
  SaleAttrResponseData,
  SpuData,
  SpuHasImg,
  HasSaleAttrResponseData,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
} from '@/api/product/spu/type'
import {
  reqAllSaleAttr,
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
} from '@/api/product/spu'
import { ref } from 'vue'

let $emit = defineEmits(['changeScene'])
// 点击取消按钮：通知父组件切换场景为1
const cancel = () => {
  $emit('changeScene', 0)
}

// 存储已有的SPU这些数据
const allTradeMark = ref<Trademark[]>([])
// 商品图片
const imgList = ref<SpuImg[]>([])
// 销售属性
const saleAttr = ref<SaleAttr[]>([])
// 全部的销售属性
const allSaleAttr = ref<HasSaleAttr[]>([])

// 初始化 SPU 数据
const initHasSpuData = async (spu: SpuData) => {
  // spu: 即为父组件传递过来的已有SPU对象
  // 获取全部品牌的数据
  const result: AllTradeMark = await reqAllTradeMark()
  if (result.code === 200) {
    allTradeMark.value = result.data
  }
  // 获取某一个品牌旗下的全部售卖商品的图片列表
  const result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  if (result1.code === 200) {
    imgList.value = result1.data
  }
  // 获取已有的SPU销售属性的数据
  const result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  if (result2.code === 200) {
    saleAttr.value = result2.data
  }
  // 获取整个项目全部SPU的销售属性
  const result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  if (result3.code === 200) {
    allSaleAttr.value = result3.data
  }
  console.log(allSaleAttr.value)
}
// 对外暴露
defineExpose({ initHasSpuData })
</script>
<style scoped></style>
