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
// 关注或
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}
// 取消关注
export function UnfollowUser (autid) {
  return request({
    url: `/user/followings/${autid}`,
    method: 'delete'
  })
}
export function getUserInfo () {
  return request({
    url: '/user'

  })
}
//  获取用户资料
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}
// /user/photo
export function uploadPhoto (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data
  })
}

export function saveUser (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data: { ...data, photo: null }
  })
}
