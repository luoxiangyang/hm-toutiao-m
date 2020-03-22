// 文章列表
import request from '@/utils/request'
export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params } // 相当于合并数据
  })
}
// 不感兴趣的文章接口
export function dislikeArt (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}
export function reportsArticle (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data
  })
}
