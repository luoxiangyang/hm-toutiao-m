// 处理token读写和删除的文件

const USER_TOKEN = 'heima-toutiao-mobile-94' // 专门用来存储用户信息
// 设置用户的token
export function setUSer (user) {
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}
// 获取token
export function getUser () {
  // 因为传入的是JSON字符串 所以要去转为对象
  // JSON.parse()如果是个空字符串就报错
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}')
}
// 删除token
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
