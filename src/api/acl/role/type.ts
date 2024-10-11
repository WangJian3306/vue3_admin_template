export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 全部数据类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: string
}

// 全部角色的数组ts类型
export type Records = RoleData[]
// 全部角色数据响应的ts类型
export interface RoleResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: 1
    searchCount: boolean
  }
}
