<template>
  <div class="container">
    <van-tabs v-model="activeIndex" @change="changeTab">
      <van-tab   v-for="item in channels" :key="item.id" :title="item.name">
        <!-- 接收子组件的时间 showMore -->
        <ArticleList @showMore="openMore" :channels_id="item.id"> </ArticleList>
      </van-tab>
    </van-tabs>
    <span class="bar_btn">
      <van-icon @click="showChannelEdit=true" name="wap-nav"></van-icon>
    </span>
    <van-popup style="width:80%" v-model="showMore">
      <!-- @事件名:方法名($event) $event事件参数 在自定义事件中就是自定义事件传出的第一个参数-->
      <moreArticle @report="dislikeOrReport('report',$event)" @dislike="dislikeOrReport('dislike')"></moreArticle>
    </van-popup>
    <van-action-sheet :round="false" v-model="showChannelEdit" title="编辑频道">
      <channelEdit @addChannel="addChannel" @delChannel='delChannel' :activeIndex="activeIndex" :channels="channels" @selectChannel="selectChannel" />
    </van-action-sheet>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import { getMyChannels, delChannel, addChannel } from '@/api/channels.js'
import moreArticle from './components/morearticles'
import { dislikeArt, reportsArticle } from '@/api/articles.js'
import eventBus from '@/utils/eventBus.js'
import channelEdit from './components/channel_edit'
export default {
  components: {
    ArticleList, moreArticle, channelEdit
  },
  data () {
    return {
      channels: [],
      showMore: false,
      articleId: null, // 作者id
      activeIndex: 0,
      showChannelEdit: false // 频道编辑组件
    }
  },
  methods: {
    changeTab () {
      // 切换页签事件
      // 切换页签时广播一个消息 让对应的页签文章列表去滚动他的滚动条
      eventBus.$emit('changeTab', this.channels[this.activeIndex].id)
    },
    // 添加频道
    async addChannel (channel) {
      await addChannel(channel)
      // 将我的频道添加一个频道
      this.channels.push(channel)
    },
    async delChannel (id) {
      // 删除频道
      try {
        await delChannel(id)
        const index = this.channels.findIndex(item => item.id === id)
        if (index <= this.activeIndex) {
          // 删除的下标小于或等于自己的 就向前一位
          this.activeIndex = this.activeIndex - 1
        }
        this.channels.splice(index, 1)
      } catch (error) {
        this.$mynotify({ message: '删除失败' })
      }
    },
    selectChannel (id) {
      // 子组件点击频道按钮
      const index = this.channels.findIndex(item => item.id === id)
      this.activeIndex = index // 将索引给对应的变量
      // 关闭弹窗
      this.showChannelEdit = false
    },
    // async report (type) {
    //   try {
    //     // 调用接口
    //     await reportsArticle({
    //       target: this.articleId, type
    //     })
    //     this.$mynotify({ type: 'success', message: '操作成功' })
    //     eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
    //     this.showMore = false
    //   } catch (error) {
    //     this.$mynotify({ type: 'danger', message: '操作失败' })
    //   }
    // },
    async getMyChannels () {
      const data = await getMyChannels()
      // 从接口获取的数据给
      this.channels.push(...data.channels)
    },
    openMore (artId) {
      this.showMore = true
      // 这里把id存起来 当前不喜欢再调接口
      this.articleId = artId
    },
    async dislikeOrReport (operateType, type) {
      try {
        // 需要根据参数来判断 是举报还是不喜欢
        // 如果参数是dislike就是不敢情趣
        operateType === 'dislike' ? await dislikeArt({
          target: this.articleId
        }) : await reportsArticle({
          target: this.articleId, type
        })

        this.$mynotify({ type: 'success', message: '操作成功' })
        // 利用时间广播的机制 找对应的tab
        // this.channels[activeIndex].id // 当前频道的数据 this.channels[]当前频道索引的下标
        eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        this.showMore = false
      } catch (error) {
        this.$mynotify({ type: 'danger', message: '操作失败' })
      }
    }

  },
  created () {
    this.getMyChannels()
  }

}
</script>
<style lang="less" scoped>
// 面板样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
