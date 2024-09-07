<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加按钮 -->
    <el-button type="primary" size="default" icon="Plus" @click="addTrademark">添加品牌</el-button>
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
          <el-button type="primary" size="small" icon="Edit" @click="updateTrademark"></el-button>
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
      @current-change="changePageNo"
      @size-change="sizeChange"
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :size="size"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
    />
  </el-card>

  <!-- 对话框组件：添加品牌与修改品牌的业务时候使用 -->
  <!-- 
    v-model: 控制对话框的显示与隐藏，ture 显示 false 隐藏
    title：设置对话框左上角标题
   -->
  <el-dialog v-model="dialogFormVisible" title="添加品牌" width="500">
    <el-form style="width: 80%">
      <el-form-item label="品牌名称" label-width="80px">
        <el-input placeholder="请输入品牌名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO">
        <el-upload
          class="avatar-uploader"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!--具名插槽：footer -->
    <template #footer>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
      <el-button type="primary" size="default" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
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

// 控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)

// 获取已有品牌的接口封装维一个函数：在任何情况下获取数据，调用此函数即可
const getHasTrademark = async () => {
  const result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code == 200) {
    // 存储已有品牌总个数
    total.value = result.data.total

    trademarkArr.value = result.data.records
  }
}

// 分页器当前页码发生变化的时候会触发
// pagination 是回传了当前的页码数据
const changePageNo = () => {
  // 当前页面发生变化的时候再次发请求获取对应已有品牌数据展示
  getHasTrademark()
}

// 当下拉菜单变化的时候会触发此方法
// pagination 会将下拉菜单中选中数据返回
const sizeChange = () => {
  // 当前页显示数量变化的时候，当前页面归1
  pageNo.value = 1
  getHasTrademark()
}

// 添加品牌按钮的回调
const addTrademark = () => {
  // 对话框要显示
  dialogFormVisible.value = true
}

// 修改已有品牌的按钮的回调
const updateTrademark = () => {
  // 对话框要显示
  dialogFormVisible.value = true
}

// 对话框底部取消按钮
const cancel = () => {
  // 对话框隐藏
  dialogFormVisible.value = false
}
// 对话框底部确定按钮
const confirm = () => {
  // 对话框隐藏
  dialogFormVisible.value = false
}

// 组件挂载完毕，发送请求获取数据
onMounted(() => {
  getHasTrademark()
})
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
