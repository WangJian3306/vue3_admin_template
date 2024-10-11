import request from '@/utils/request'
import type { PermissionResponsData } from './type'

// 枚举地址
enum API {
  // 获取全部菜单与按钮的标识数据
  ALLPERMISSION_URL = '/admin/acl/permission',
}

// 获取菜单数据
export const reqAllPermisson = () => request.get<any, PermissionResponsData>(API.ALLPERMISSION_URL)
