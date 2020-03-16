/**
 * 导航守卫
 */
import router from '@/router'
import store from '@/store'

// 前置守卫 每当路由发生变化时 前置守卫就会执行
// to 从哪来 from 到哪去  next 必须执行的函数 放行
router.beforeEach(function (to, from, next) {
  // 如果为user 为开头的并且没有token就要拦截
  if (to.path.startsWith('/user') && !store.state.user.token) {
    next({
      path: '/login', // 要跳转的地址
      query: {
        redirectUrl: to.fullPath // 被拦截下来的地址
      }
    })
  } else {
    next() // 放行
  }
})
