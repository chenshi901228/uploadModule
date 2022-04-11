<template>
  <div v-loading.fullscreen.lock="loading" :element-loading-text="$t('loading')" :class="['aui-wrapper', { 'aui-sidebar--fold': $store.state.sidebarFold }]">
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div class="aui-content__wrapper" :style="{ 'min-height': (documentClientHeight - 50) + 'px' }">
        <main-content v-if="!$store.state.contentIsNeedRefresh"/>
      </div>
      <main-theme-tools />
    </template>
  </div>
</template>

<script>
import MainNavbar from './main-navbar'
import MainSidebar from './main-sidebar'
import MainContent from './main-content'
import MainThemeTools from './main-theme-tools'
import debounce from 'lodash/debounce'
import { isURL } from '@/utils/validate'
import TIM from 'tim-js-sdk';

export default {
  provide () {
    return {
      // 刷新
      refresh () {
        this.$store.state.contentIsNeedRefresh = true
        this.$nextTick(() => {
          this.$store.state.contentIsNeedRefresh = false
        })
      }
    }
  },
  data () {
    return {
      loading: true
    }
  },
  components: {
    MainNavbar,
    MainSidebar,
    MainContent,
    MainThemeTools
  },
  watch: {
    $route: 'routeHandle'
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.documentClientHeight;
      },
      set(val) {
        this.$store.commit("updateDocumentClientHeight", val);
      },
    },
  },
  created () {
    this.windowResizeHandle()
    this.routeHandle(this.$route)
    Promise.all([
      this.getUserInfo(),
      this.getPermissions()
    ]).then(() => {
      this.loading = false
    })
  },
  methods: {
    // 窗口改变大小
    windowResizeHandle () {
      this.documentClientHeight = document.documentElement["clientHeight"];
      this.$store.state.sidebarFold = document.documentElement['clientWidth'] <= 992 || false
      window.addEventListener('resize', debounce(() => {
        this.$store.state.sidebarFold = document.documentElement['clientWidth'] <= 992 || false
        this.documentClientHeight = document.documentElement["clientHeight"];
      }, 150))
    },
    // 路由, 监听
    routeHandle (route) {
      if (!route.meta.isTab) {
        return false
      }
      let tab = {}
      let routeName = route.name
      let routeMeta = route.meta
      if (route.name === 'iframe') {
        let url = route.query.url || ''
        if (!isURL(url)) {
          return false
        }
        let key = route.query.key || new Date().getTime()
        routeName = `${routeName}_${key}`
        routeMeta.title = key.toString()
        routeMeta.menuId = route.query.menuId || ''
        routeMeta.iframeURL = url
      }
      tab = this.$store.state.contentTabs.filter(item => item.name === routeName)[0]
      if (!tab) {
        tab = {
          ...window.SITE_CONFIG['contentTabDefault'],
          ...routeMeta,
          'name': routeName,
          'params': { ...route.params },
          'query': { ...route.query }
        }
        this.$store.state.contentTabs = this.$store.state.contentTabs.concat(tab)
      }
      this.$store.state.sidebarMenuActiveName = tab.menuId
      this.$store.state.contentTabsActiveName = tab.name
    },
    // 获取当前管理员信息
    getUserInfo () {
      return this.$http.get('/sys/user/info').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$store.state.user.id = res.data.id
        this.$store.state.user.name = res.data.username
        this.$store.state.user.realName = res.data.realName
        this.$store.state.user.superAdmin = res.data.superAdmin
        this.$http.get('/sys/manage/tencentCloudIm/getTxCloudUserSig').then(res=>{ //获取腾讯IM签名
            let userId = res.data.data.liveUserId&&res.data.data.liveUserId
            let userSig = res.data.data.userSig&&res.data.data.userSig
            this.loginIM(userId,userSig)
        }).catch(() => {})
      }).catch(() => {})
    },
    loginIM(userID,userSig){ //登录腾讯IM
      let options = {
        SDKAppID: 1400341701 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
      };
      // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
      let tim = TIM.create(options); // SDK 实例通常用 tim 表示
      // 开始登录 
      console.log('1111',userID,userSig)
      tim.login({userID: userID, userSig: userSig});
      tim.on(TIM.EVENT.SDK_READY, (event)=>{
        // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
        // event.name - TIM.EVENT.SDK_READY
        console.log(event)
      });
    },
    // 获取权限
    getPermissions () {
      return this.$http.get('/sys/menu/permissions').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        window.SITE_CONFIG['permissions'] = res.data
      }).catch(() => {})
    }
  }
}
</script>
