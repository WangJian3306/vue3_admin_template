// 数据类型定义

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 菜单与按钮数据的ts类型
export interface Permission {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: string
  level: number
  children?: PermissionList
  select: boolean
}

export type PermissionList = Permission[]

// 菜单接口返回数据类型
export interface PermissionResponsData extends ResponseData {
  data: PermissionList
}

// 添加与修改菜单携带参数ts类型
export interface MenuParams {
  id?: number
  level: number
  code: string // 权限值
  name: string // 菜单名称
  pid: number // 父菜单id
}
