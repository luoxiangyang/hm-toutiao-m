<template>
  <div class="comment">
    <van-list v-model="loading" @load="onLoad" :finished="finished" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="item in comments" :key="item.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="item.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{item.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{item.like_count}}</span>
            </span>
          </p>
          <p>{{item.content}}</p>
          <p>
            <span class="time">{{item.pubdate | relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(item.com_id.toString())">{{item.reply_count}}回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else @click="submit" slot="button">提交</span>
      </van-field>
    </div>
     <!-- 回复 -->
     <!-- @closed 关闭面板时i触发 将commentId设置为空 -->
    <van-action-sheet @closed="reply.commentId=null" v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <van-list @load="getReply" :immediate-check="false"  v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{item.aut_name}}</span></p>
            <p>{{item.content}}</p>
            <p><span class="time">{{item.pubdate | relTime}}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments, commentOrReply } from '@/api/articles'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 评论
      offset: null, // 分页的依据 请求第二页 拿第一页最后一个数据的id
      showReply: false, // 评论的评论面板是否显示
      reply: {
        //   评论的评论数据控制
        loading: false,
        finished: false,
        offset: null,
        list: [], // 存放评论的评论的数据
        // 用commentId来判断是文章的评论还是评论的评论
        commentId: null // 存放评论ID
      }
    }
  },
  methods: {
    async submit () {
      // 提交评论
      // 判断用户是否登录
      if (this.$store.state.user.token) {
        // 判断是否输入了内容
        if (!this.value) return false
        // 打开loading状态
        this.submiting = true
        await this.$sleep(800)
        try {
          const data = await commentOrReply({
            content: this.value,
            art_id: this.reply.commentId ? this.$route.query.artId : null,
            // 用commentId来判断是文章的评论还是评论的评论
            target: this.reply.commentId
              ? this.reply.commentId.toString() : this.$route.query.artId

          })
          // 返回data.new_obj 是添加成功的一条数据
          if (this.reply.commentId) {
            // 表示对评论进行评论
            // 将数据添加到评论的评论
            this.reply.list.unshift(data.new_obj)
            // 需要找到对应的评论id将评论id的回复数加1
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId)
            comment && comment.reply_count++
          } else {
            this.comments.unshift(data.new_obj)
          }
        } catch (error) {
          this.$mynotify({ message: '此文章限制评论' })
        }
        this.value = ''
        this.submiting = false
      } else {
        try {
          // 提示登录
          await this.$dialog.comfirm({
            message: '想要评论,请先登录'
          })
          // query参数是用户登陆成功之后需要回到的页面
          this.$router.push({
            path: '/login',
            query: { redirect: this.$route.fullPath }
          })
        } catch (error) {

        }
      }
    },
    openReply (commentId) {
      //   评论的评论
      this.showReply = true
      this.reply.commentId = commentId
      //   先把之前的数据清空 在添加
      this.reply.list = []
      this.reply.offset = null
      this.reply.finished = false // 打开finished
      this.reply.loading = true
      this.getReply()
    },
    async getReply () {
      // 用来获取评论的评论
      const date = await getComments({
        type: 'c', // a表示文章的评论 c表示评论的评论
        source: this.reply.commentId,
        offset: this.reply.offset
      })
      this.reply.list.push(...date.results)
      this.reply.loading = false
      this.reply.finished = date.last_id === date.end_id
      if (!this.reply.finished) {
        this.reply.offset = date.last_id
      }
    },
    async onLoad () {
      // 内容距离下方有一定距离就会触发
      const { artId } = this.$route.query // 从路由参数取文章的id
      const date = await getComments({
        type: 'a', // a表示文章的评论 c表示评论的评论
        source: artId,
        offset: this.offset
      })
      this.comments.push(...date.results)
      this.loading = false // 关闭上拉加载
      //   判断是否还有下一页
      //   date.end_id === date.last_id =>finished=true
      this.finished = date.end_id === date.last_id // 如果两个id相等
      if (!this.finished) {
        //   表示还没结束 没有相等 把当前页最后一个id给offset 给下面加载数据
        this.offset = date.last_id
      }
    }
  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
