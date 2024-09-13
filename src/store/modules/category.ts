// 商品分类全局组件的小仓库
import { reqC1, reqC2, reqC3 } from '@/api/product/attr/index'
import { defineStore } from 'pinia'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './type/type'

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      // 一级分类数据
      c1Arr: [],
      // 一级分类ID
      c1Id: '',

      // 二级分类数据
      c2Arr: [],
      // 二级分类ID
      c2Id: '',

      // 三级分类数据
      c3Arr: [],
      // 三级分类ID
      c3Id: '',
    }
  },
  actions: {
    // 获取一级分类方法
    async getC1() {
      const result: CategoryResponseData = await reqC1()
      if (result.code === 200) {
        this.c1Arr = result.data
      }
    },
    // 获取二级分类方法
    async getC2() {
      const result: CategoryResponseData = await reqC2(this.c1Id)
      if (result.code === 200) {
        this.c2Arr = result.data
        console.log(result.data)
      }
    },

    // 获取三级分类方法
    async getC3() {
      const result: CategoryResponseData = await reqC3(this.c2Id)
      if (result.code === 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore
