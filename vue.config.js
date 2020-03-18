module.exports = {
  // 需要更改less变量的配置
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 可以改变变量的值
          blue: '#3296fa'
        }
      }
    }
  }
}
