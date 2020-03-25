<template>
  <div class="container">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | relTime}}</p>
        </div>
        <van-button
          :loading="followLoading"
          @click="follow"
          round
          size="small"
          type="info"
        >{{article.is_followed ? '已关注' :'+关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <van-button
          round
          size="small"
          :class="{active:article.attitude ===1}"
          plain
          icon="like-o"
        >点赞</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <van-button
          round
          size="small"
          :class="{active:article.attitude ===0}"
          plain
          icon="delete"
        >不喜欢</van-button>
      </div>
      <!-- 评论组件 -->
    <Comment></Comment>
    </div>

    <!-- 遮罩层 -->
    <div class="loading-content">
      <van-overlay :show="loading">
        <van-loading type="spinner"></van-loading>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'
import { followUser, UnfollowUser } from '@/api/user'
import Comment from './compoment/comment'
export default {
  components: {
    Comment
  },
  data () {
    return {
      article: [], // 接收详情数据
      followLoading: false,
      loading: false
    }
  },
  methods: {
    async getArticleInfo () {
      this.loading = true
      const { artId } = this.$route.query // 读取路由中的query参数
      this.article = await getArticleInfo(artId)
      this.loading = false
    },
    async follow () {
      this.followLoading = true
      // 关注或取消 根据article.is_followed状态来判断关注还是没关注
      try {
        if (this.article.is_followed) {
          await UnfollowUser(this.article.aut_id)
        } else {
          await followUser({
            target: this.article.aut_id
          })
        }
        // 移动端重新加载 会直接修改对应数据
        // 判断当前的作者id是否是自己的id
        this.article.is_followed = !this.article.is_followed
        this.$mynotify({ type: 'success', message: '操作成功' })
      } catch (error) {
        this.$mynotify({ message: '操作失败' })
      } finally {
        // 不论写的执行是成功还是失败都会执行
        this.followLoading = false
      }
      // this.article.is_followed = !this.article.is_followed
    }
  },
  created () {
    this.getArticleInfo()
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay {
  background: none;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}

</style>
