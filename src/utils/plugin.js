/**
 * 负责封装小函数以及过滤器
 */
export default {
  install (Vue) {
    // 会在Vue.use 时使用
    // 因为这里vant以及执行完毕
    Vue.prototype.$mynotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep
  }
}
// es6 设置默认值 如果传入time就用传入的
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
