// 处理postcss插件
module.exports = {
  plugins: {
    //   自动给css样式加前缀的属性
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 基准值
      propList: ['*'] // 所有文件都转化位rem
    }

  }
}
