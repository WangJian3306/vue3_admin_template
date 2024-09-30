export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 定义SKU对象的ts类型
// SKU 平台属性
export interface SkuAttrValue {
  attrId: string | number // 平台属性ID
  valueId: string | number // 属性值ID
  attrName: string
  id: number
  skuId: number
  valueName: string
}

// SKU 图片
export interface SkuImg {
  id: number
  skuId: number
  imgName: string
  imgUrl: string
  spuImgId: number
  isDefault: string
}

// SKU 销售属性
export interface SkuSaleAttrValue {
  saleAttrId: string | number // 销售属性ID
  saleAttrValueId: string | number // 销售属性值ID
  id: number
  saleAttrName: string
  saleAttrValueName: string
  skuId: number
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
  skuImageList: SkuImg[] // SKU 图片
  skuDefaultImg: string // 售卖SKU图片地址
  isSale: number // 商品上架与下架
  id: number // 商品ID
}

// 获取 SKU 接口返回的数据 ts 类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: true
    pages: boolean
  }
}

// SKU商品详细接口TS类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
