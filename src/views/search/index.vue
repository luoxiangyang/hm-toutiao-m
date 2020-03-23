<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search @search="onSearch" v-model.trim="q"  placeholder="请输入搜索关键词" shape="round" />
    <van-cell-group class="suggest-box" v-if="q">
      <!-- 搜索建议 -->
      <van-cell @click="toResult(item)" v-for="(item,index) in suggestion" :key="index" icon="search">
        <span>{{item}}</span>
      </van-cell>
    </van-cell-group>
    <div class="history-box" v-else>
      <div v-if="historyList.length" class="head">
        <span>历史记录</span>
        <van-icon @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <van-cell @click="toResult(item)" v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <!-- 事件冒泡了 event.stopPagintion()
          vue stop修饰符 组织事件冒泡-->
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/articles'
const key = 'hm-94-toutiao-history' // 历史记录在本地缓存
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键字的数据
      suggestion: [], // 联想的搜索
      historyList: JSON.parse(localStorage.getItem(key) || '[]') // 搜索历史纪录
    }
  },
  watch: {
    q () {
      // 防抖
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (!this.q) {
          // 搜索没内容
          this.suggestion = []
          return
        }
        const result = await getSuggestion({ q: this.q })
        this.suggestion = result.options // 返回数据赋值给
      }, 500)
    }
    // 节流
    // if (!this.timer) {
    //   this.timer = setTimeout(async () => {
    //     this.timer = null
    //     if (!this.q) {
    //     // 搜索没内容
    //       this.suggestion = []
    //       return
    //     }
    //     const result = await getSuggestion({ q: this.q })
    //     this.suggestion = result.options // 返回数据赋值给
    //   }, 500)
    // }
  },
  methods: {
    toResult (text) {
      this.historyList.push(text)
      this.historyList = Array.from(new Set(this.historyList))
      // 设置到本地缓存
      localStorage.setItem(key, JSON.stringify(this.historyList))
      // 跳转
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    delHistory (index) {
      this.historyList.splice(index, 1) // 删除对应的历史记录
      // 将本地缓存的也删除
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // toSearchResult (text) {
    // // 路由传参
    // // this.$router.push('/search/result?q=' + item)
    //   this.$router.push({ path: '/search/result', query: { q: text } })
    // },
    async clear () {
      try {
        // 清空历史记录
        await this.$dialog.comfirm({
          title: '提示',
          message: '确认删除记录吗'
        })
        this.historyList = []
        localStorage.setItem(key, '[]')
      } catch (error) {

      }
    },
    onSearch () {
      if (!this.q) {
        return // 为空直接返回
      }
      // 把搜索记录存到本地
      this.historyList.push(this.q)
      // 因为不能让搜索记录相同
      this.historyList = Array.from(new Set(this.historyList))
      localStorage.setItem(key, JSON.stringify(this.historyList))
      //  搜索之后跳转到结果页面 判断搜索内容为空
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  }
  // created () {
  //   this.historyList = JSON.parse(localStorage.getItem(key) || [])
  // }
}

</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
