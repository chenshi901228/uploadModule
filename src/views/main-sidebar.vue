<template>
  <aside :class="['aui-sidebar', `aui-sidebar--${$store.state.sidebarLayoutSkin}`]">
    <div class="aui-navbar__header">
      <h1 class="aui-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="aui-navbar__brand-lg" href="javascript:;">{{ $t('brand.lg') }}</a>
        <a class="aui-navbar__brand-mini" href="javascript:;">{{ $t('brand.mini') }}</a>
      </h1>
    </div>
    <div class="aui-sidebar__inner">
      <el-menu
        :default-active="$store.state.sidebarMenuActiveName"
        :collapse="$store.state.sidebarFold"
        :unique-opened="true"
        :active-text-color="$store.state.theme"
        :collapseTransition="false"
        class="aui-sidebar__menu">
        <sub-menu v-for="menu in $store.state.sidebarMenuList" :key="menu.id" :menu="menu" />
      </el-menu>
    </div>
  </aside>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
export default {
  data () {
    return {
    }
  },
  components: {
    SubMenu
  },
  created () {
    this.$store.state.sidebarMenuList = window.SITE_CONFIG['menuList']
  }
}
</script>
<style lang="scss" scoped>
/deep/.aui-sidebar__inner{
  padding-bottom: 50px;
}
</style>
