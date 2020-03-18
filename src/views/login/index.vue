<template>
  <div class="container">
    <van-nav-bar title="登录" left-arrow @click-left="$router.go(-1)"></van-nav-bar>
    <!-- 输入框 -->
    <van-cell-group>
      <van-field @blur="checkMobile" :error-message="errorMessage.mobile" v-model.trim="loginForm.mobile" label="手机号" placeholder="请输入手机号"></van-field>
      <van-field @blur="checkCode" :error-message="errorMessage.code" v-model.trim="loginForm.code" label="验证码" placeholder="请输入验证码">
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="login-box">
          <van-button @click="login" type="info" block  round size="small" >登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 表单数据
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      errorMessage: {
        mobile: '',
        code: ''
      }

    }
  },
  methods: {
    ...mapMutations(['uploadUser']),
    async login () {
      // 如果都通过就表示通过校验

      if (this.checkMobile() && this.checkCode()) {
        try {
          // 引用过来的方法传入参数
          const result = await login(this.loginForm)
          // 修改vuex的state 必须通过mutations
          console.log(result)

          this.uploadUser({ user: result })
          // 判断又没要跳转的页面 如果有就跳转
          const { redirectUrl } = this.$route.query // 获取地址带的query参数
          this.$router.push(redirectUrl || '/')
        } catch (error) {
          this.$notify({
            message: '手机号或验证码错误',
            duration: 1000
          })
        }
      }
    },
    checkMobile () {
      if (!this.loginForm.mobile) {
        this.errorMessage.mobile = '手机号不能为空'
        return false // false表示此轮校验没通过
      }
      // 如果不满足正则 就返回错误信息
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      this.errorMessage.mobile = ''
      return true
    },
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }
      // 如果不满足正则 就返回错误信息
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码必须为6位数字'
        return false
      }
      this.errorMessage.code = ''
      return true
    }
  }
}
</script>

<style lang="less" >
.login-box {
  padding: 20px;
}
</style>
