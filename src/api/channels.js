// 频道数据
import request from '@/utils/request'
import store from '@/store'
const CACHE_CHANNEL_V = 'hm-94-toutiao-v'
const CACHE_CHANNEL_T = 'hm-94-toutiao-t'
// 改造成本地化
// export function getMyChannels () {
//   return request({
//     url: '/user/channels'

//   })
// }
export function getMyChannels () {
  // 因为编辑用户频道有问题 我们需要本地化
  return new Promise(function (resolve, reject) {
    // 本地化缓存 区分登录还是游客
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const str = localStorage.getItem(key)
    if (str) {
      // 本地有数据的话
      resolve({ channels: JSON.parse(str) })
    } else {
      request({ url: '/user/channels' }).then(result => {
        localStorage.setItem(key, JSON.stringify(result.channels))
        resolve(result)
      }) // 得到数据放入缓存
    }
  })
}
export function getAllChannels () {
  return request({
    url: '/channels'

  })
}
// 删除频道
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 从缓存删除对应id数据
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const channels = JSON.parse(localStorage.getItem(key)) // 将本地字符串转化成对象
    // channels = channels.filter(item => item.id !== id)
    // localStorage.setItem(key, JSON.stringify(channels))

    // 第二种
    const index = channels.findIndex(item => item.id === id)
    if (index > -1) {
      channels.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(channels))
      // Promise 执行成功要reslove
      resolve()
    } else {
      reject(new Error('没有找到对应的频道'))
    }
  })
}
// 添加频道的方法 channel{id:'',name:'css'}
export function addChannel (channel) {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const channels = JSON.parse(localStorage.getItem(key))
    channels.push(channel)
    localStorage.setItem(key, JSON.stringify(channels))
    resolve()
  })
}
