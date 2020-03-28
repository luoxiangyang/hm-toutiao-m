<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" @click-right="saveUSer" title="编辑资料" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          @click="showPhoto=true"
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="名称" @click="showName=true" :value="user.name" />
      <van-cell is-link title="性别" @click="showGender=true" :value="user.gender ===0 ? '男': '女'" />
      <van-cell is-link title="生日" @click="showDate" :value="user.birthday" />
    </van-cell-group>
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <van-cell @click="openChangeFile" is-link title="本地相册选择图片"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 弹昵称 -->
    <van-popup v-model="showName" :close-on-click-overlay="false" style="width:80%">
      <!-- 编辑用户昵称  双向绑定用户的昵称-->

      <van-field :error-message="nameMsg" v-model.trim="user.name" type="textarea" rows="4"></van-field>
      <van-button @click="btnName" type="info" block size="large">确定</van-button>
    </van-popup>
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
        currentDate="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmDate"
        @cancel="showBirthDay = false"
      />
    </van-popup>
    <!-- 放置一个input 用来上传图片 -->
    <input @change="upload" ref="myfile" type="file" style="display:none">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, uploadPhoto, saveUser } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      user: {
        name: '',
        gender: 1, // 性别
        birthday: '',
        photo: ''
      },
      showPhoto: false,
      showName: false,
      showGender: false,
      actions: [{ name: '男' }, { name: '女' }], //
      showBirthDay: false,
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      nameMsg: ''
    }
  },
  methods: {
    ...mapMutations(['uploadPhoto']),
    async saveUSer () {
      try {
        await saveUser(this.user)
        this.$mynotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$mynotify({ message: '保存失败' })
      }
    },
    async upload () {
      // 选择完头像上传
      const data = new FormData()
      data.append('photo', this.$refs.myfile.files[0])

      const result = await uploadPhoto(data)
      this.user.photo = result.photo
      // 修改成功的头像设置给vuex
      this.uploadPhoto({ photo: result.photo })
      this.showPhoto = false
    },
    openChangeFile () {
      // 打开文件上传框
    // 触发input的click的事件
      this.$refs.myfile.click()
    },
    selectItem (item, index) {
      // van-action-sheet这个组件自带参数可以检测到action
      this.user.gender = index
      this.showGender = false
    },
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '用户的昵称应该在1-7个字符'
        return
      }
      this.nameMsg = ''
      this.showName = false
    },
    showDate () {
      this.showBirthDay = true
      // 将生日转化为字符串绑定到currentDate
      this.currentDate = new Date(this.user.birthday)
    },
    confirmDate () {
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
      this.showBirthDay = false
    },
    async getUserProfile () {
      this.user = await getUserProfile()
    }
  },
  created () {
    this.getUserProfile()
  }
}
</script>

<style>
</style>
