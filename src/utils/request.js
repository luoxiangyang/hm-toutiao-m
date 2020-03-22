/**
 * request.js 负责请求管理
 * create by lxy 2020/03/16
 */
import axios from 'axios'
import JSONbig from 'json-bigint'
import store from '@/store'
import router from '@/router'
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
  if (store.state.user.token) {
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
}, async function (error) {
  /**
     * error  config 错误的配置  response 响应的数据.status
     */
  // 只要是401 就是token失效
  if (error.response && error.response.status === 401) {
    const path = router.push({
      path: '/login',
      query: {
        redirectUrl: router.currentRoute.fullPath
      }
    })
    //   判断是否有refresh_token
    if (store.state.user.refresh_token) {
      // 有refresh_token 就换取新token
      // 这里必须要用axios，因为token已经失效了instance的拦截器还是会去将失效的token注入headers
      // 需要没有拦截器的axios 发刷新token的请求
      try {
        const result = await axios({
          // baseurl是上面配置给instance的 这里没有
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` },
          method: 'put'
        })
        // 更新vuex的token
        store.commit('uploadUser', {
          user: {
            token: result.data.data.token,
            refresh_token: store.state.user.refresh_token
          }
        })
        // 执行之前401 错误的请求
        // return 请求的目的继续执行这个请求这个执行链下面的请求
        return instance(error.config)
      } catch (error) {
        // refresh_token失败
        store.commit('delUser')
        router.push(path)
      }
    } else {
    //   router.push('/login')
      // 获取当前路由带参数的地址
      //   router.currentRoute.fullPath
      // 重新登录成功之后 再跳回原来的页面
      store.commit('delUser')
      router.push(path)
    }
  }
  return Promise.reject(error)
})
export default instance
