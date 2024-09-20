<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select style="width: 240px" v-model="SpuParams.tmId">
        <el-option
          v-for="item in allTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请输入SPU描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!-- v-model:fileList -> 展示默认图片
            action: 上传图片的接口
            list-type: 文件列表的类型
            on-preview: 预览文件
            on-remove： 删除文件
        -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%" />
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
import { ElMessage, type UploadUserFile } from 'element-plus'

let $emit = defineEmits(['changeScene'])
// 点击取消按钮：通知父组件切换场景为1
const cancel = () => {
  $emit('changeScene', 0)
}

// 存储已有的SPU这些数据
const allTradeMark = ref<Trademark[]>([])
// 商品图片
const imgList = ref<SpuImg[] | UploadUserFile[]>([])
// 销售属性
const saleAttr = ref<SaleAttr[]>([])
// 全部的销售属性
const allSaleAttr = ref<HasSaleAttr[]>([])
// 控制图片对话框的现实与隐藏
const dialogVisible = ref<boolean>(false)
// 存储预览图片的地址
const dialogImageUrl = ref<string>('')

// 存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3id: '',
  spuName: '',
  description: '',
  tmId: '',
  sppuImageList: [],
  spuSaleAttrList: [],
})

// 初始化 SPU 数据
const initHasSpuData = async (spu: SpuData) => {
  // 存储已有的SPU对象，将来在模版中展示
  SpuParams.value = spu
  // spu: 即为父组件传递过来的已有SPU对象
  // 获取全部品牌的数据
  const result: AllTradeMark = await reqAllTradeMark()
  if (result.code === 200) {
    allTradeMark.value = result.data
  }
  // 获取某一个品牌旗下的全部售卖商品的图片列表
  const result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  if (result1.code === 200) {
    imgList.value = result1.data.map((item) => {
      return {
        name: item.imgName,
        url: item.imgUrl,
      }
    })
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

// 照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (uploadFile: any) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

// 照片墙删除文件钩子
const handleRemove = () => {
  ElMessage({
    type: 'success',
    message: '图片已删除',
  })
}

// 照片上传成功之前的钩子，约束文件的大小与类型
const handleUpload = (uploadFile: any) => {
  if (
    uploadFile.type === 'image/png' ||
    uploadFile.type === 'image/jpeg' ||
    uploadFile.type === 'image/gif'
  ) {
    if (uploadFile.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件务必小于3M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件务必PNG|JPG|GIF',
    })
    return false
  }
}

// 对外暴露
defineExpose({ initHasSpuData })
</script>
<style scoped></style>
