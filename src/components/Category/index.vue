<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          style="width: 240px"
          v-model="categoryStore.c1Id"
          @change="handler"
          :disabled="scene === 0 ? false : true"
        >
          <!-- option: label 即为显示文字， value 属性即为下来菜单收集的数据 -->
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          style="width: 240px"
          v-model="categoryStore.c2Id"
          @change="handler1"
          :disabled="scene === 0 ? false : true"
        >
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          style="width: 240px"
          v-model="categoryStore.c3Id"
          :disabled="scene === 0 ? false : true"
        >
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script lang="ts" setup name="Category">
// 引入生命周期函数钩子
import { onMounted } from 'vue'
// 引入分类相关的仓库
import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()

// 分类全集组件挂载完毕，通知仓库发请求获取一级分类的数据
onMounted(() => {
  getC1()
})

// 通知仓获取一级分类的方法
const getC1 = () => {
  return categoryStore.getC1()
}

// 一级分类下拉菜单change事件
const handler = () => {
  // 需要将二级和三级分类数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  // 通知仓库获取二级分类数据
  categoryStore.getC2()
}

// 二级分类下拉菜单change事件
const handler1 = () => {
  // 清理三级分类数据
  categoryStore.c3Id = ''
  // 通知仓库获取二级分类数据
  categoryStore.getC3()
}

// 接收父组件传递过来的scene
defineProps(['scene'])
</script>
<style scoped></style>
