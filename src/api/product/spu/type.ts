import type { Attr } from '../attr/type'

// 服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU数据的ts类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: string | number
  tmId: number | string
  spuSaleAttrList: null | SaleAttr[]
  spuImageList: null | SpuImg[]
}
// 数组：元素都是已有SPU数据类型
export type Records = SpuData[]
// 定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 品牌数据的TS类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}
// 品牌接口返回的数据ts类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

// 商品图片的ts类型
export interface SpuImg {
  id?: number
  spuId?: number
  imgName: string
  imgUrl: string
}
// 已有的SPU的照片墙数据的类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 已有的销售属性值对象ts类型
export interface SaleAttrValue {
  id?: number
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

// 存储已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象
export interface SaleAttr {
  id?: number
  spuId?: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}

// SPU 已有的销售属性接口返回数据ts类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 已有的全部SPU的返回数据 ts 类型
export interface HasSaleAttr {
  id: number
  name: string
}
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

// SKU 平台属性
export interface SkuAttrValue {
  attrId: string | number // 平台属性ID
  valueId: string | number // 属性值ID
}

// SKU 销售属性
export interface SkuSaleAttrValue {
  saleAttrId: string | number // 销售属性ID
  saleAttrValueId: string | number // 销售属性值ID
}

// SKU 数据
export interface SkuData {
  category3Id: string | number // 三级分类的ID
  spuId: string | number // 已有的SPU的ID
  tmId: string | number // SPU 品牌ID
  skuName: string // SKU 名字
  price: string | number // SKU 价格
  weight: string | number // SKU 重量
  skuDesc: string // SKU 描述
  skuAttrValueList: SkuAttrValue[] // 平台属性
  skuSaleAttrValueList: SkuSaleAttrValue[] // 销售属性
  skuDefaultImg: string // 售卖SKU图片地址
}

// 获取 SKU 数据接口的 ts 类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}

// 平台属性加个字段用于获取SKU平台属性
export interface SkuAttr extends Attr {
  attrIdAndValueId?: string
}

// SPU 销售属性加个字段用于获取SKU销售属性
export interface SkuSaleAttr extends SaleAttr {
  saleIdAndValueId?: string
}
