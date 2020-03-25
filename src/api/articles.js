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
// 获取联想搜索建议
export function getSuggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}
// 搜索文章
export function searchArticle (params) {
  return request({
    url: '/search',
    params
  })
}
// 文章详情
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`
  })
}
// 评论
export function getComments (params) {
  return request({
    url: '/comments',
    params
  })
}

// 评论回复 1文章评论 2 评论的评论
export function commentOrReply (data) {
  return request({
    url: '/comments',
    method: 'post',
    data
  })
}
