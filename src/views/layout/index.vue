<template>
  <div class="container">
    <!-- 导航 -->
    <!-- 判断当前是不是user 如果是就v-if隐藏 -->
    <van-nav-bar
    title="黑马头条"
    right-text="搜索"
    fixed
    v-if="$route.path!==`/user`"
    @click-right="$router.push('/search')"
    ></van-nav-bar>
    <!-- 二级路由容器 -->
    <div class="my-wrapper" :class="{noTop: $route.path === `/user`}">
      <router-view></router-view>
    </div>

    <!-- 标签栏 -->
    <van-tabbar route >
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/question">问答</van-tabbar-item>
      <van-tabbar-item icon="tv-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.container{
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}

</style>
