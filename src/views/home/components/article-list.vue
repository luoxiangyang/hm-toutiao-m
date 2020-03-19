<template>
  <!-- 首页的列表 -->
  <!-- 上拉加载   放这个div为了形成滚动条 -->
  <div class="scroll-wrapper">
    <!-- van-list 组件不加干涉 初始化完毕就会检测自己距离底部的长度如果超过了限定就会
    执行loading事件 自动把upLoading改撑true-->
    <van-pull-refresh v-model="isLoading" @refresh="onrefresh" :success-text="successText">
      <van-list finished-text="我也是有底线的" v-model="upLoading" :finished="finished" @load="onload">
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item.art_id.toString()">
            <!-- 三张图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <div class="img_box" v-if="item.cover.type ===3">
                <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <div class="img_box" v-if="item.cover.type ===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}评论</span>
                <span>{{item.pubdate2}}</span>
                <span class="close">
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
export default {
  props: {
    channels_id: {
      required: true, // 此属性为必填项 为true 就是必填
      type: Number, // 表示要传入的prop的属性的类型
      default: null // 默认值  假如没有传入prop 默认值就会使用
    }
  },
  data () {
    return {
      successText: '',
      upLoading: false, // 是否再上拉加载
      finished: false, // 是否已经完成所有数据的加载
      articles: [],
      isLoading: false,
      timestamp: null // 用来存历史时间戳
    }
  },
  methods: {
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
