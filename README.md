# vue3_admin_template

硅谷甄选前端学习项目，跟着老师视频手敲出来的，有些地方跟老师不一样，仅供参考。

## 项目启动

使用 Nodejs v18.16.1 版本。

1. 安装 pnpm

```
npm install pnpm -g
```

2. 安装依赖包：

```sh
pnpm install
```

3. 本地启动项目：

```sh
pnpm dev
```

## 与后端项目配合使用

[后端这个项目](https://github.com/WangJian3306/vue3_admin_backend.git)是我实现的后端API项目，在本地运行后，可以与此项目配合使用（妈妈再也不怕老师的接口断网啦）。

在`.env.development`中修改`VITE_SERVE`为本地运行后端项目的地址:
```
VITE_APP_BASE_API = '/api'
# VITE_SERVE = 'http://sph-api.atguigu.cn' # 老师提供的API地址，当不能用时，可以试试下面这个。
VITE_SERVE = 'http://127.0.0.1:10086'       # 本地运行的后端API地址
```

登录账号：admin

密码：111111

（完）