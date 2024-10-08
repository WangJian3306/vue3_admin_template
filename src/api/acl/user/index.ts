// 用户管理模块接口
import request from '@/utils/request'
import type { User, UserResponseData } from './type'
// 枚举地址
enum API {
  // 获取全部已有用户
  ALLUSER_URL = '/admin/acl/user/',
  // 添加一个新的用户
  ADDUSER_URL = '/admin/acl/user/save',
  // 更新已有用户账号
  UPDATEUSER_URL = '/admin/acl/user/update',
}

// 获取用户接口
export const reqUserList = (page: number, limit: number) =>
  request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}`)

// 添加用户与更新用户接口
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    //携带参数有ID，更新
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}
