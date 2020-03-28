<template>
    <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="mylist">
      <div class="chat-item" :class="{left:item.name==='xz',right:item.name!=='xz'}" v-for="(item,index) in list" :key="index">
        <van-image v-if="item.name==='xz'" fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
        <div class="chat-pao">{{item.msg}}</div>
        <van-image v-if="item.name!=='xz'"  fit="cover" round :src="photo" />
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>

      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import io from 'socket.io-client'
export default {
  data () {
    return {
      list: [],
      loading: false,
      value: ''
    }
  },
  methods: {
    scrollBottom () {
      // 将内容滚动到底部
      // 将滚动条 滚动到最底部
      // vuejs 数据变化=》试图更新 是异步的 因为调用这个方法 上面的数据是异步的 会先
      // 执行这里的滚动

      // $nextTick 表示此函数 会在上一个数据更新并且完成页面渲染之后执行
      this.$nextTick(() => {
        this.$refs.mylist.scrollTop = this.$refs.mylist.scrollHeight
      })
    },
    async send () {
      // 调用websocket发送消息
      if (!this.value) return false
      this.loading = true // 打开loading加载状态
      await this.$sleep()
      // 发消息emit  服务器on
      // this.socket.emit(消息类型，消息内容)
      const obj = { msg: this.value, timestamp: Date.now() }
      this.socket.emit('message', obj)
      this.list.push(obj)
      this.value = ''
      this.loading = false
      this.scrollBottom()
    }
  },
  beforeDestroy () {
    this.socket.io.close()
  },
  created () {
    // 建立与服务器连接
    this.socket = io('http://ttapi.research.itcast.cn', {
      // 固定写法会拼接到url地址上
      query: {
        token: this.user.token
      }
    })
    // connect 固定写法  表示当前建立连接成功
    this.socket.on('connect', () => {
      this.list.push({ msg: '你好', name: 'xz' })
    })
    this.socket.on('message', data => {
      // data没有name 结构加上name
      this.list.push({ ...data, name: 'xz' })
      this.scrollBottom()
    })
  },
  computed: {
    ...mapState(['photo', 'user'])
  }

}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
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
}
</style>
