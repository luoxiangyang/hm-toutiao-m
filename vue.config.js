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
  },
  configureWebpack: (config) => {
    // config是当前vue-cli项目所有的webpack配置
    // 想要改动直接修改这个信息
    // 判断当前的环境是开发环境还是生产环境
    if (process.env.NODE_ENV === 'production') {
      // 删除console  删除打包出来的console
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  publicPath: './'
}
