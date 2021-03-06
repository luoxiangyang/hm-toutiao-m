import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission'
import store from './store'
import Vant, { Lazyload } from 'vant' // 组件库
import plugin from '@/utils/plugin'
import 'vant/lib/index.less' // 这里改成less 因为要修改变量 css没有变量
import 'amfe-flexible'
import '@/styles/index.less'

Vue.use(Vant)
Vue.use(plugin)
Vue.use(Lazyload)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
