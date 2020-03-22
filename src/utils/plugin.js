/**
 * 负责封装小函数以及过滤器
 */
import dayjs from 'dayjs'
import relativetime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativetime)
export default {
  install (Vue) {
    // 会在Vue.use 时使用
    // 因为这里vant以及执行完毕
    Vue.prototype.$mynotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep
    Vue.filter('relTime', relTime) // 全局过滤器
  }
}
// es6 设置默认值 如果传入time就用传入的
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
/** 此函数用来将日期转化成相对时间  articles.vue */
function relTime (data) {
  return dayjs().locale('zh-cn').from(data) // data相对于当前时间
}
