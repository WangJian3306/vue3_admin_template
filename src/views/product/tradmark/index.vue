<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加按钮 -->
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        @click="addTrademark"
        v-has="`btn.Trademark.add`"
      >
        添加品牌
      </el-button>
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
          <template v-slot="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-popconfirm
              :title="`确定删除${row.tmName}？`"
              width="auto"
              icon="Delete"
              @confirm="removeTrademark(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
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
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
      width="500"
    >
      <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- upload组件属性： action：上传图片请求地址 -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="headers"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
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
  </div>
</template>
<script lang="ts" setup name="Tradmark">
import { ref, onMounted, reactive, nextTick } from 'vue'
import type { ComponentSize, UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type { Records, TradeMarkResponseData, Trademark } from '@/api/product/trademark/type'

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

// 收集添加品牌表单数据
let trademarkParams = reactive<Trademark>({
  logoUrl: '',
  tmName: '',
})

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
  // 清空数据
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = 0

  // 清空校验提示
  // 第一种写法: ts 的问号语法
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')

  // 第二种写法：nextTick()
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

// 修改已有品牌的按钮的回调
const updateTrademark = (row: Trademark) => {
  // 对话框要显示
  dialogFormVisible.value = true

  // 展示已有品牌的数据
  // trademarkParams.id = row.id
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  // ES6 合并对象写法
  Object.assign(trademarkParams, row)

  // 清空校验提示
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

// 对话框底部取消按钮
const cancel = () => {
  // 对话框隐藏
  dialogFormVisible.value = false
}
// 对话框底部确定按钮
const confirm = async () => {
  // 在发送请求之前对整个表单进行校验
  await formRef.value.validate() // 调用这个方法进行表单校验，如果校验全部通过，再执行后续的代码
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  // 添加｜修改品牌
  if (result.code === 200) {
    // 关闭对话框
    dialogFormVisible.value = false
    // 提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌' : '添加品牌成功',
    })
    // 再次发请求获取新的品牌数据
    pageNo.value = trademarkParams.id ? pageNo.value : 1 // 添加跳转的第一页，修改不跳转
    getHasTrademark()
  } else {
    // 添加品牌失败
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
  }
}

// 上传图片组件 -> 上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 要求：上传文件格式 png|jpg|gif 4M
  if (
    rawFile.type === 'image/png' ||
    rawFile.type === 'image/jpeg' ||
    rawFile.type === 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小必须小于 4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的文件类型需要为：png、jpg、gif',
    })
    return false
  }
}

// 图片上传成功后的钩子函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  // response：即为当前这次上传图片返回的数据
  // uploadFile： 上传的图片信息，及返回的数据
  trademarkParams.logoUrl = response.data

  // 图片上传成功，清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}

// 品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
  // 自定义校验规则
  if (value.trim().length >= 2) {
    callBack()
  } else {
    // 校验未通过返回的错误提示信息
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}

// 品牌LOGO图片的自定义校验规则
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  // 如果图片上传
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片务必上传'))
  }
}

// 获取 el-form 组件实例
let formRef = ref()

// 表单校验规则对象
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, trigger: 'change', validator: validatorLogoUrl }],
}

// 气泡确认框确认按钮的回调
const removeTrademark = async (id: number) => {
  // 删除品牌
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    // 删除成功提示信息
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    // 再次获取已有的品牌数据
    trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1
    getHasTrademark()
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}

// 组件挂载完毕，发送请求获取数据
onMounted(() => {
  getHasTrademark()
})

// el-upload 上传 http 请求头，携带 Token
// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'
// 获取用户相关的小仓库：获取仓库内部token，登录成功以后携带给服务器
const userStore = useUserStore()
const headers = { Token: userStore.token }
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
