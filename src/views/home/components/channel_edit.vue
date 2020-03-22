<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
            <!-- 给父传当前点击的 频道id来跳转到当前的对应频道 -->
          <span @click="$emit('selectChannel',item.id)" :class="{red:index==activeIndex}" class="f12">{{item.name}}</span>
          <!-- 第一个频道永远不删除 点击差号调用父组件方法 -->
          <van-icon @click="$emit('delChannel',item.id)" v-if="index!==0 &&editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <!-- 传出一个频道对象 -->
          <van-icon @click="$emit('addChannel',item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
//   props: ['channels'],
  props: {
    channels: {
      required: true, // 是否必填
      type: Array, // 类型
      default: () => [] // 此函数默认返回一个空数组
    },
    // 父组件传过来 当前频道的下标
    activeIndex: {
      required: true,
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      editing: false,
      AllChannels: []
    }
  },
  methods: {
    async getAllChannels () {
      const result = await getAllChannels()
      this.AllChannels = result.channels // 把接口数据赋值给
    }
  },
  computed: {
    optionalChannels () {
      // 全部频道减去当前频道
    //   filter 筛选
      return this.AllChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  },
  created () {
    this.getAllChannels()
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
