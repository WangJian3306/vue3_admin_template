// 属性相关API
import request from '@/utils/request'
import type { CategoryResponseData } from './type'

enum API {
  // 获取一级分类接口地址
  C1_URL = '/admin/product/getCategory1',
  // 获取二级分类接口地址
  C2_URL = '/admin/product/getCategory2/',
  //  获取二级分类接口地址
  C3_URL = '/admin/product/getCategory3/',
}

// 获取一级分类接口方法
export const reqC1 = () => {
  return request.get<any, CategoryResponseData>(API.C1_URL)
}
// 获取二级分类接口方法
export const reqC2 = (category1Id: number) => {
  return request.get<any, CategoryResponseData>(API.C2_URL + category1Id)
}
// 获取三级分类接口方法
export const reqC3 = (category2Id: number) => {
  return request.get<any, CategoryResponseData>(API.C3_URL + category2Id)
}
