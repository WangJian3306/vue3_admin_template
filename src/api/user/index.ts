// 统一管理咱们项目用户相关的接口
import request from '@/utils/request'
import type { loginForm, loginResponse, userInfoRespons } from './type'
// 统一管理接口
enum API {
  LOGIN_URL = '/user/login',
  USERINFO_URL = '/user/info',
}

// 暴露请求函数
// 登录接口方法 {}
export const reqLogin = (data: loginForm) => request.post<any, loginResponse>(API.LOGIN_URL, data)
// 获取用户信息
export const reqUserInfo = () => request.get<any, userInfoRespons>(API.USERINFO_URL)
