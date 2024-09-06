//
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 已有品牌的数据ts数据类型
export interface Trademark {
  id?: number
  tmName: string
  logoUrl: string
}

// 包含全部品牌数据的ts类型
export type Records = Trademark[]

// 获取的已有全部品牌的数据 ts 类型
export interface TradeMarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
