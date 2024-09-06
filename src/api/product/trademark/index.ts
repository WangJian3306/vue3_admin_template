// 品牌管理模块接口
import request from '@/utils/request'
import type { TradeMarkResponseData } from './type'
// 品牌管理模块接口地址
enum API {
  // 获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
}

// 获取已有品牌数据接口方法
// page：获取第几页数据，默认第一页
// limit：每页中数据条数
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)
