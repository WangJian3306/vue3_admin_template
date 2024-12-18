// 品牌管理模块接口
import request from '@/utils/request'
import type { TradeMarkResponseData, Trademark } from './type'
// 品牌管理模块接口地址
enum API {
  // 获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 新增品牌接口
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改品牌接口
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  // 删除已有品牌
  DELTETRADEMARK_URL = '/admin/product/baseTrademark/remove/',
}

// 获取已有品牌数据接口方法
// page：获取第几页数据，默认第一页
// limit：每页中数据条数
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)

// 新增与修改品牌接口方法
export const reqAddOrUpdateTrademark = (data: Trademark) => {
  // 修改已有品牌的数据
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    // 新增品牌
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

// 删除某一个已有品牌的数据
export const reqDeleteTrademark = (id: number) => {
  return request.delete<any, any>(API.DELTETRADEMARK_URL + id)
}
