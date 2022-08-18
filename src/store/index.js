import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 页面文档可视宽度(随窗口改变大小)
    documentClientWidth: 0,
    // 导航条, 布局风格, defalut(白色) / colorful(鲜艳)
    navbarLayoutType: 'colorful',
    // 侧边栏, 布局皮肤, default(白色) / dark(黑色)
    sidebarLayoutSkin: 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 侧边栏, 菜单
    sidebarMenuList: [],
    sidebarMenuActiveName: '',
    // 内容, 是否需要刷新
    contentIsNeedRefresh: false,
    // 工具栏
    tool: false,
    // 内容, 标签页(默认添加首页)
    contentTabs: [
      {
        ...window.SITE_CONFIG['contentTabDefault'],
        'name': 'home',
        'title': 'home'
      }
    ],
    contentTabsActiveName: 'home', //当前tab标签页
    theme: "#3558cc" //主题颜色
  },
  modules: {
    user
  },
  mutations: {
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        if(key != "contentTabsActiveName") {
          state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key])
        }
      })
    },
    // 更新窗口高度
    updateDocumentClientHeight(state, height) {
      state.documentClientHeight = height
    },
    // 更新窗口宽度
    updateDocumentClientWidth(state, width) {
      state.documentClientWidth = width
    },
    // 更新主题颜色
    updateTheme(state, color) {
      state.theme = color
    },
  }
})
