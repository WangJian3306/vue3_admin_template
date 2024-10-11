// 角色管理模块接口
import request from '@/utils/request'
import type { RoleResponseData } from './type'
// 枚举地址
enum API {
  // 获取全部的角色接口
  ALLROLE_URL = '/admin/acl/role/',
}

// 获取全部的角色
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}?roleName=${roleName}`)
