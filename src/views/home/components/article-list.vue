<template>
  <!-- 首页的列表 -->
  <!-- 上拉加载   放这个div为了形成滚动条 -->
  <div class="scroll-wrapper" @scroll="remember" ref="myscroll">
    <!-- van-list 组件不加干涉 初始化完毕就会检测自己距离底部的长度如果超过了限定就会
    执行loading事件 自动把upLoading改撑true-->
    <van-pull-refresh v-model="isLoading" @refresh="onrefresh" :success-text="successText">
      <van-list finished-text="我也是有底线的" v-model="upLoading" :finished="finished" @load="onload">
        <van-cell-group>
          <!-- van-cell加to属性可以跳转对应路由 传参 -->
          <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
            <!-- 三张图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <div class="img_box" v-if="item.cover.type ===3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <div class="img_box" v-if="item.cover.type ===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}评论</span>
                <span>{{item.pubdate | relTime}}</span>
                <!-- 根据store的token来判断 -->
                <span class="close" @click.stop="$emit('showMore',item.art_id.toString())" v-if="$store.state.user.token">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
            <!-- <div class="img_box">
              <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
            </div> -->
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>

import { getArticles } from '@/api/articles'
import eventBus from '@/utils/eventBus.js'
export default {
  props: {
    channels_id: {
      required: true, // 此属性为必填项 为true 就是必填
      type: Number, // 表示要传入的prop的属性的类型
      default: null // 默认值  假如没有传入prop 默认值就会使用

    }
  },
  created () {
    eventBus.$on('delArticle', (artId, channelId) => {
      //  如果自身的channel_id 跟参数相同 说明当前就是要删除数据的实例
      if (this.channels_id === channelId) {
        // 找到item里面的作者id 返回下标 然后删除下标对应的数据
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        // 大于-1 表示数据存在
        if (index > -1) {
          this.articles.splice(index, 1)
        }
        if (this.articles.length === 0) {
          // 数据被删完
          this.onload() // 手动请求数据
        }
      }
    })
    eventBus.$on('changeTab', (id) => {
      if (id === this.channels_id) {
        this.$nextTick(
          () => {
            if (this.scrollTop && this.$refs.myscroll) {
              this.$refs.myscroll.scrollTop = this.scrollTop
            }
          }
        )
      }
    })
  },
  data () {
    return {
      successText: '',
      upLoading: false, // 是否再上拉加载
      finished: false, // 是否已经完成所有数据的加载
      articles: [],
      isLoading: false,
      timestamp: null, // 用来存历史时间戳
      scrollTop: 0 // 定义虚拟dom滚动的位置

    }
  },
  methods: {
    remember (event) {
      // 用防抖监听滚动事件
      clearTimeout(this.Timer)
      this.Timer = setTimeout(() => {
        // 记录滚动的位置
        // console.log(event.target)
        this.scrollTop = event.target.scrollTop
      }, 500)
    },
    async onrefresh () {
      // setTimeout(() => {
      //   const Arr = Array.from(Array(2), (value, index) => index + 10)
      //   this.articles.unshift(...Arr)
      //   this.isLoading = false
      //   this.successText = `更新了${Arr.length}条数据`
      // }, 1000)
      // 下拉刷新应该发送最新的时间戳
      const data = await getArticles({
        channel_id: this.channels_id,
        timestamp: Date.now()
      })
      this.isLoading = false
      // 需要判断时间戳能否换来数据  就将数据整个替换
      // 如果不能就发送没有数据
      //
      if (data.results.length) {
        this.articles = data.results // 替换所有数据
        if (data.pre_timestamp) {
          // 因为下拉有新数据 需要将finished关闭
          this.finished = false // 可以继续上拉加载
          this.timestamp = data.pre_timestamp
        }
        this.successText = `刷新成功!更新了${data.results.length}条数据`
      } else {
        this.successText = '当前已经是最新的数据'
      }
    },
    async onload () {
      // // setTimeout(() => {
      // //   this.finished = true // 表示数据已经全部加载完毕
      // // }, 1000)
      // if (this.articles.length > 50) {
      //   this.finished = true
      // } else {
      //   const arr = Array.from(Array(15), (value, index) => index + 1)
      //   // 把数据追加到数组
      //   this.articles.push(...arr)
      //   this.upLoading = false
      // }
      await this.$sleep(500) // 人为控制了请求时间
      const data = await getArticles({ channel_id: this.channels_id, timestamp: this.timestamp || Date.now() })
      this.articles.push(...data.results)
      this.upLoading = false
      // 如果有时间戳就记住  没有就结束
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        this.finished = true
      }
    }
  },
  activated () {
    // 激活函数 没有删除dom的时候 再次点开会调用acticated
    if (this.$refs.myscroll && this.scrollTop) {
      // 判断滚动位置是否有
      // 如果有就滚动为原来的位置
      this.$refs.myscroll.scrollTop = this.scrollTop
    }
  }
}
</script>

<style lang="less" >
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
