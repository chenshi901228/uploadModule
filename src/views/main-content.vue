<template>
  <main :class="['aui-content', { 'aui-content--tabs': $route.meta.isTab }]">
    <!-- tab展示内容 -->
    <template v-if="$route.meta.isTab">
      <!-- <el-dropdown class="aui-content--tabs-tools">
        <i class="el-icon-arrow-down"></i>
        <el-dropdown-menu slot="dropdown" :show-timeout="0">
          <el-dropdown-item @click.native="tabRemoveHandle($store.state.contentTabsActiveName)">{{ $t('contentTabs.closeCurrent') }}</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseOtherHandle()">{{ $t('contentTabs.closeOther') }}</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseAllHandle()">{{ $t('contentTabs.closeAll') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <el-tabs 
        v-model="$store.state.contentTabsActiveName" 
        @tab-click="tabSelectedHandle" 
        @tab-remove="tabRemoveHandle">
        <el-tab-pane
          v-for="item in $store.state.contentTabs"
          :key="item.name"
          :name="item.name"
          :closable="item.name !== 'home'"
          :class="{ 'is-iframe': tabIsIframe(item.iframeURL) }">
          <template>
            <span @contextmenu.prevent="openMenu($event)" slot="label" :data-tabname="item.name">{{item.title == 'home' ? '首页' : item.title}}</span>
          </template>
          <iframe v-if="tabIsIframe(item.iframeURL)" :src="item.iframeURL" width="100%" height="100%" frameborder="0" scrolling="yes"></iframe>
          <keep-alive v-else>
            <router-view v-if="item.name === $store.state.contentTabsActiveName" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
      <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
        <li @click="refreshPage"><i class="el-icon-refresh-right"></i> 刷新页面</li>
        <li v-if="selectedTag != 'home'" @click="tabRemoveHandle(selectedTag)"><i class="el-icon-close"></i> {{ $t('contentTabs.closeCurrent') }}</li>
        <li @click="tabsCloseOtherHandle()"><i class="el-icon-circle-close"></i> {{ $t('contentTabs.closeOther') }}</li>
        <!-- <li v-if="!isFirstView()" @click="closeLeftTags"><i class="el-icon-back"></i> 关闭左侧</li>
        <li v-if="!isLastView()" @click="closeRightTags"><i class="el-icon-right"></i> 关闭右侧</li> -->
        <li @click="tabsCloseAllHandle()"><i class="el-icon-circle-close"></i> {{ $t('contentTabs.closeAll') }}</li>
      </ul>
    </template>
    <!-- 其他方式, 展示内容 -->
    <template v-else>
      <keep-alive>
        <router-view />
      </keep-alive>
    </template>
  </main>
</template>

<script>
import { isURL } from '@/utils/validate'
export default {
  inject: ['refresh'],
  data () {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: "", //右键选中的tab
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  methods: {
    // tabs, 是否通过iframe展示
    tabIsIframe (url) {
      return isURL(url)
    },
    // tabs, 选中tab
    tabSelectedHandle (tab) {
      tab = this.$store.state.contentTabs.filter(item => item.name === tab.name)[0]
      if (tab) {
        this.$router.push({
          'name': /^iframe_.+/.test(tab.name) ? 'iframe' : tab.name,
          'params': { ...tab.params },
          'query': { ...tab.query }
        })
      }
    },
    // tabs, 删除tab
    tabRemoveHandle (tabName) {
      if (tabName === 'home') {
        return false
      }
      this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name !== tabName)
      if (this.$store.state.contentTabs.length <= 0) {
        this.$store.state.sidebarMenuActiveName = this.$store.state.contentTabsActiveName = 'home'
        return false
      }
      // 当前选中tab被删除
      if (tabName === this.$store.state.contentTabsActiveName) {
        let tab = this.$store.state.contentTabs[this.$store.state.contentTabs.length - 1]
        this.$router.push({
          name: /^iframe_.+/.test(tab.name) ? 'iframe' : tab.name,
          params: { ...tab.params },
          query: { ...tab.query }
        })
      }
    },
    // tabs, 关闭其它
    tabsCloseOtherHandle () {
      this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => {
        return item.name === 'home' || item.name === this.selectedTag
      })
      if(this.$store.state.contentTabs.length == 1) { //只剩首页则跳转到首页
        if(this.$store.state.contentTabsActiveName == 'home') return
        this.$router.push({ name: 'home' })
      }else {
        let tab = this.$store.state.contentTabs.filter(item => {
          return item.name === this.selectedTag
        })[0]
        // 如果是不是当前tab，跳转
        if(tab.name == this.$store.state.contentTabsActiveName) return
        this.$router.push({
          name: /^iframe_.+/.test(tab.name) ? 'iframe' : tab.name,
          params: { ...tab.params },
          query: { ...tab.query }
        })
      }
    },
    // tabs, 关闭全部
    tabsCloseAllHandle () {
      this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name === 'home')
      if(this.$store.state.contentTabsActiveName == 'home') return
      this.$router.push({ name: 'home' })
    },
    // 刷新页面
    refreshPage() {
      let tab = {}
      tab["params"] = this.$route.params
      tab["query"] = this.$route.query
      tab["name"] = this.selectedTag
      if(this.$route.name == this.selectedTag) return this.refresh()
      this.tabSelectedHandle(tab)
      this.refresh()
    },
    // tab标签右键操作
    openMenu(e) {
      e.preventDefault()
      const menuMinWidth = 136
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth + offsetLeft - menuMinWidth // left boundary
      const left = e.clientX + 10

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }
      this.top = e.clientY
      this.visible = true
      this.selectedTag = e.target.dataset.tabname
    },
    // 关闭标签页
    closeMenu() {
      this.visible = false
    },
  }
}
</script>
<style lang="scss" scoped>
.contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: fixed;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
</style>
