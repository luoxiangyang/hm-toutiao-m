/**
 * store 下的index.js 专门处理vuex的模块
 */
import Vue from 'vue'
import Vuex from 'vuex'
// 表示引用auth 内所有的平常对象并命名为auth
import * as auth from '@/utils/auth.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser(), // token信息对象
    photo: null
  },
  mutations: {
    uploadUser (state, payload) {
      state.user = payload.user
      auth.setUser(payload.user) // 保持vuex和本地同步
    },
    delUser (state) {
      state.user = {} // 将vuex中的token设置为空
      auth.delUser() // 删除本地
    },
    uploadPhoto (state, payload) {
      state.photo = payload.photo
    }
  },
  actions: {
  },
  modules: {
  }
})
