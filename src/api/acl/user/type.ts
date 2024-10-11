// 账号信息的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 用户信息ts类型
export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  roleName?: string
  phone?: string
}

// 数组包含全部的用户信息
export type Records = User[]

// 获取全部用户信息接口返回数据ts类型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

// 角色ts类型
export interface Role {
  id?: number
  createTime: string
  updateTime: string
  roleName: string
  remark: string
}

// 所有角色列表
export type AllRole = Role[]

// 获取全部角色接口返回数据ts类型
export interface AllRoleResponseData extends ResponseData {
  data: {
    assignRoles: AllRole
    allRolesList: AllRole
  }
}

// 给用户分配角色接口携带参数ts类型
export interface SetRoleData {
  roleIdList: number[]
  userId: number
}
