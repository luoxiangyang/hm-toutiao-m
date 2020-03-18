/**
 * 处理用户相关的请求
 */
// 导出一个登录方法
// 引用：import * as obj from...
// request相当于一个axios的实例 相当于axios同样的效果
import request from '@/utils/request'
export function login (data) {
  return request({
    url: '/authorizations',
    method: 'post',
    data
  })
}
