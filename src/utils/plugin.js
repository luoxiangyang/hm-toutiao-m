/**
 * 负责封装小函数以及过滤器
 */
export default {
  install (Vue) {
    // 会在Vue.use 时使用
    // 因为这里vant以及执行完毕
    Vue.prototype.$mynotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
  }
}
