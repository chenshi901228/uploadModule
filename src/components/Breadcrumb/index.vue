<!-- 头部菜单导航 -->

<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="!item.path || item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      if(this.$route.name == "home") return this.levelList = [{ path: '/home', meta: { title: '首页' }}]
      if(this.$route.name == "sys-userDetail") return this.levelList = [{ path: '/sys-userDetail', meta: { title: '个人中心' }}]
      if(this.$route.name == "myMessage-index") return this.levelList = [{ path: '/myMessage-index', meta: { title: '我的消息' }}]
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/home', meta: { title: '首页' }}].concat(matched)
      }

      // 处理 main-dynamic-menu 显示
      matched.map((item, index) => {
        if(item.name == "main-dynamic-menu") {
          if(index + 1 != matched.length && item.meta) {
            item.meta.title = matched[index + 1]["meta"]["parentName"] || "main-dynamic-menu"
          }
        }
        return item
      })

      this.levelList = matched.filter(item => item.meta && item.meta.title)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim() === 'Home'
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
