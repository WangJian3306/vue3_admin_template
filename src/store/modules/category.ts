// 商品分类全局组件的小仓库
import { reqC1 } from '@/api/product/attr/index'
import { defineStore } from 'pinia'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './type/type'

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      // 一级分类数据
      c1Arr: [],
      // 一级分类数据
      c1Id: '',
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
  },
  getters: {},
})

export default useCategoryStore
