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
        :headers="headers"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性下拉菜单 -->
      <el-select
        style="width: 240px"
        :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'"
        v-model="saleAttrIdAndValueName"
      >
        <el-option
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        :disabled="saleAttrIdAndValueName ? false : true"
        @click="addSaleAttr"
      >
        添加属性
      </el-button>
      <!-- table 展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
        <el-table-column label="销售属性值">
          <!-- row即为当前spu已有的销售属性对象 -->
          <template v-slot="{ row }">
            <el-tag
              v-for="(item, $index) in row.spuSaleAttrValueList"
              :key="item.id"
              style="margin: 0px 5px"
              class="mx-1"
              closable
              @close="row.spuSaleAttrValueList.splice($index, 1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              @blur="toLook(row)"
              v-model="row.saleAttrValue"
              v-if="row.flag === true"
              placeholder="请输入属性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button
              @click="toEdit(row)"
              v-else
              type="primary"
              size="small"
              icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="{ $index }">
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="default"
        @click="save"
        :disabled="saleAttr.length > 0 ? false : true"
      >
        保存
      </el-button>
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
  SaleAttrValue,
} from '@/api/product/spu/type'
import {
  reqAllSaleAttr,
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
import { computed, ref } from 'vue'
import { ElMessage, type UploadUserFile } from 'element-plus'

let $emit = defineEmits(['changeScene'])
// 点击取消按钮：通知父组件切换场景为1
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
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
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
})

// el-upload 上传 http 请求头，携带 Token 
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'
// 获取用户相关的小仓库：获取仓库内部token，登录成功以后携带给服务器
const userStore = useUserStore()
const headers = {Token: userStore.token}

// 将来手机还未选择的销售属性的ID与属性值的名字
const saleAttrIdAndValueName = ref<string>('')

// 初始化 SPU 数据
const initHasSpuData = async (spu: SpuData) => {
  // 存储已有的SPU对象，将来在模版中展示
  // spu: 即为父组件传递过来的已有SPU对象
  SpuParams.value = spu
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

// 计算当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  // 全部销售属性：颜色、版本、尺码
  // 已有的销售属性：颜色、版本
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

// 添加销售属性的方法
const addSaleAttr = () => {
  /*
        baseSaleAttrId: number
        saleAttrName: string
        spuSaleAttrValueList: SpuSaleAttrValueList
    */
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  // 准备一个新的销售属性对象：将来带给服务器即可
  let newSaleAtrr: SaleAttr = {
    baseSaleAttrId: Number(baseSaleAttrId),
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 追加到数组当中
  saleAttr.value.push(newSaleAtrr)
  // 清空收集的数据
  saleAttrIdAndValueName.value = ''
}

// 属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
  // 点击按钮，显示input组件，进入编辑模式
  row.flag = true
  row.saleAttrValue = ''
}

// 表单元素失去焦点的回调
const toLook = (row: SaleAttr) => {
  // 整理收集到的属性的ID与属性的名字
  const { baseSaleAttrId, saleAttrValue } = row

  // 非法情况判断
  if (saleAttrValue?.trim() === '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空的',
    })
    return
  }

  // 整理成服务器需要的属性值形式
  const newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }

  // 判断属性值是否在数组当中存在
  const repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName === saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 切换为查看模式
  row.flag = false
}

// 保存按钮的回调
const save = async () => {
  // 整理参数
  // 1. 照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, // 图片的名字
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  // 2. 整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value
  // console.log(SpuParams.value.spuSaleAttrList)

  // 发送请求：添加SPU｜更新已有的SPU
  const result = await reqAddOrUpdateSpu(SpuParams.value)
  // console.log(result)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    })
    // 切换场景为0
    $emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' })
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败',
    })
  }
}

// 添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  // 清空数据
  Object.assign(SpuParams.value, {
    id: 0,
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: [],
  })
  // 清空照片墙
  imgList.value = []
  // 清空销售属性
  saleAttr.value = []
  // 清空数据
  saleAttrIdAndValueName.value = ''
  // 存储三级分类ID
  SpuParams.value.category3Id = c3Id
  // 获取全部品牌的数据
  const result: AllTradeMark = await reqAllTradeMark()
  if (result.code === 200) {
    allTradeMark.value = result.data
  }

  // 获取整个项目全部SPU的销售属性
  const result2: HasSaleAttrResponseData = await reqAllSaleAttr()
  if (result2.code === 200) {
    allSaleAttr.value = result2.data
  }
}

// 对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>
<style scoped></style>
