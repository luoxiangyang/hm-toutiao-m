/**
 * request.js 负责请求管理
 * create by lxy 2020/03/16
 */
import axios from 'axios'
import JSONbig from 'json-bigint'
import store from '@/store'
// axios.create相当于new了一个新的实例 与之前的axios没有关系
const instance = axios.create({
  // 构造函数 传入配置
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',
  transformResponse: [function (data) {
    //   data就是后端响应回来的字符串
    return data ? JSONbig.parse(data) : {}
  }]
})
// 请求拦截器加上token
instance.interceptors.request.use(function (config) {
  // 读取配置信息 注入token
  if (config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error) // 返回错误 直接进入到axios的catch
})

// 响应拦截器
instance.interceptors.response.use(function (response) {
  // response 默认呗axios包了一层数据
  try {
    return response.data.data // 如果成功直接返回
  } catch (error) {
    // 如果失败则表明返回的数据没有包data 就返回一层
    return response.data
  }
}, function (error) {
  return Promise.reject(error)
})
export default instance
