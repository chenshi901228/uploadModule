<template>
  <div v-loading.fullscreen.lock="loading" :element-loading-text="$t('loading')" :style="{'--themeColor': theme}" :class="['aui-wrapper', { 'aui-sidebar--fold': $store.state.sidebarFold }]">
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div class="aui-content__wrapper" :style="{ 'min-height': (documentClientHeight - 52) + 'px' }">
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
    $route: 'routeHandle',
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
    documentClientWidth: {
      get() {
        return this.$store.state.documentClientWidth;
      },
      set(val) {
        this.$store.commit("updateDocumentClientWidth", val);
      },
    },
    theme() {
      return this.$store.state.theme
    }
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
      this.documentClientWidth = document.documentElement["clientWidth"];
      this.$store.state.sidebarFold = document.documentElement['clientWidth'] <= 992 || false
      window.addEventListener('resize', debounce(() => {
        this.$store.state.sidebarFold = document.documentElement['clientWidth'] <= 992 || false
        this.documentClientHeight = document.documentElement["clientHeight"];
        this.documentClientWidth = document.documentElement["clientWidth"];
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
        this.$store.state.user.headUrl = res.data.headUrl
        this.$store.state.user.loginType = res.data.loginType
        this.$store.state.user.weixinUserId = res.data.weixinUserId
      }).catch(() => {})
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
