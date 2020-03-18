<template>
  <!-- 首页的列表 -->
  <!-- 上拉加载   放这个div为了形成滚动条 -->
  <div class="scrollwrapper">
      <!-- van-list 组件不加干涉 初始化完毕就会检测自己距离底部的长度如果超过了限定就会
      执行loading事件 自动把upLoading改撑true -->
      <van-list v-model="upLoading" :finished="finished" @load="onload"></van-list>
  </div>

</template>

<script>
export default {
  data () {
    return {
      upLoading: false, // 是否再上拉加载
      finished: false // 是否已经完成所有数据的加载

    }
  },
  methods: {
    onload () {
      setTimeout(() => {
        this.finished = true // 表示数据已经全部加载完毕
      }, 1000)
    }
  }
}
</script>

<style>

</style>
