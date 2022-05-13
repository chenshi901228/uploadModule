<template>
  <transition name="el-fade-in-linear">
    <router-view />
  </transition>
</template>

<script>
import Cookies from 'js-cookie'
import { messages } from '@/i18n'
export default {
  watch: {
    '$i18n.locale': 'i18nHandle'
  },
  created () {
    this.i18nHandle(this.$i18n.locale)
  },
  methods: {
    i18nHandle (val, oldVal) {
      Cookies.set('language', val)
      document.querySelector('html').setAttribute('lang', val)
      document.title = messages[val].brand.lg
      // 非登录页面，切换语言刷新页面
      if (this.$route.name !== 'login' && oldVal) {
        window.location.reload()
      }
    }
  }
}
</script>
<style lang="scss">
.el-row {
    position: unset !important;
}
.el-tooltip__popper{
  max-width: 700px;
}
.live_room_popover{
  .el-slider__bar{
    background-color: #fa3622 !important;
  }
  .el-slider__button{
    border:2px solid #fe055b !important;
  }
  .el-button{
    background: linear-gradient(91deg, #fa3622 0%, #fe055b 100%) !important;
    border-color: #fe055b!important;
  }
}



</style>
