#!/usr/bin/env bash
# 发布到npm上
npm config get registry # 检查仓库镜像库
npm config set registry=https://registry.npmjs.org
echo '请进行登陆相关操作: '
npm login # 登陆
echo '------------publish---------------'
npm publish --access public
npm config set registry https://registry.npm.taobao.org # 设置淘宝镜像
echo '发布完成'
exit
