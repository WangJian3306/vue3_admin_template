// 用户管理模块接口
import request from '@/utils/request'
import type { AllRoleResponseData, SetRoleData, User, UserResponseData } from './type'
// 枚举地址
enum API {
  // 获取全部已有用户
  ALLUSER_URL = '/admin/acl/user/',
  // 添加一个新的用户
  ADDUSER_URL = '/admin/acl/user/save',
  // 更新已有用户账号
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 获取全部角色，当前账号拥有的角色接口
  ALLROLEURL = '/admin/acl/user/toAssign/',
  // 已有用户分配角色接口
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除某一个账号
  DELETEUSER_URL = '/admin/acl/user/remove/',
  // 批量删除用户接口
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
}

// 获取用户接口
export const reqUserList = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}?username=${username}`)

// 添加用户与更新用户接口
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    //携带参数有ID，更新
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

// 获取用户角色及全部角色列表
export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponseData>(API.ALLROLEURL + userId)

// 分配职务
export const reqSetUserRole = (data: SetRoleData) => request.post<any, any>(API.SETROLE_URL, data)

// 删除某一个账号的信息
export const reqRemoveUser = (userId: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + userId)

// 批量删除账号接口
export const reqRemoveBatchUser = (idList: number[]) =>
  request.delete(API.DELETEALLUSER_URL, { data: idList })
