<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag style="margin: 5px" v-for="item in row.attrValueList" :key="item.id">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <!-- row 已有的属性对象 -->
            <template #="row">
              <el-button type="primary" size="small" icon="Edit" @click="updateAttr"></el-button>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene === 1">
        <!-- 展示添加属性与修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          :disabled="attrParams.attrName.trim() ? false : true"
          type="primary"
          size="default"
          icon="Plus"
        >
          添加属性
        </el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0px" :data="attrParams.attrValueList">
          <el-table-column width="80px" type="index" align="center" label="序号"></el-table-column>
          <el-table-column label="属性值的名称">
            <!-- row：即为当前属性值对象 -->
            <template #="{ row }">
              <el-input placeholder="请你输入属性值名称" v-model="row.valueName"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作"></el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save">保存</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup name="Attr">
// 组合式 API 函数watch
import { watch, ref, reactive } from 'vue'
// 引入获取已有属性与属性接口
import { reqAttr, reqAddOrUpdateAttr } from '@/api/product/attr'
import type { AttrResponseData, AttrList, Attr } from '@/api/product/attr/type'
// 获取分类的仓库
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()

// 存储属性与属性值
const attrArr = ref<AttrList>([])

// 定义卡片组件内容切换开关
const scene = ref<number>(0) // sceno = 0, 显示table， scene= 1,显示添加与修改

// 收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '', // 新增的属性的名字
  attrValueList: [
    // 新增的属性值数组
  ],
  categoryId: '', // 三级分类ID
  categoryLevel: 3, // 代表的是三级分类
})

// 监听创建三级分类ID变化
watch(
  () => categoryStore.c3Id,
  async () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 保证三级分类有才能发请求
    if (!categoryStore.c3Id) return
    // 获取分类的ID
    getAttr()
  },
)
// 获取已有的属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  // 获取分类下的已有的属性与属性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
}

// 添加属性按钮的回调
const addAttr = () => {
  // 每一次点击的时候，先清空一下数据再收集数据
  Object.assign(attrParams, {
    attrName: '', // 新增的属性的名字
    attrValueList: [
      // 新增的属性值数组
    ],
    categoryId: attrParams.categoryId, // 三级分类ID
    categoryLevel: 3, // 代表的是三级分类
  })
  // 切换为添加与修改属性的结构
  scene.value = 1
}

// 修改属性
const updateAttr = () => {
  scene.value = 1
}
// 取消按钮回调
const cancel = () => {
  scene.value = 0
}

// 添加属性周按钮的回调
const addAttrValue = () => {
  // 点击添加属性值按钮的时候，向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
  })
}

// 保存按钮的回调
const save = async () => {
  // 发请求
  const result: any = await reqAddOrUpdateAttr(attrParams)
  // 添加属性｜修改已有的属性已经成功
  if (result.code === 200) {
    // 切换场景
    scene.value = 0
    // 提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    // 获取全部已有的属性雨属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}
</script>
<style scoped></style>
