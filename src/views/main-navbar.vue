<template>
  <nav class="aui-navbar" :class="`aui-navbar--${$store.state.navbarLayoutType}`">
    <!-- <div class="aui-navbar__header">
      <h1 class="aui-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="aui-navbar__brand-lg" href="javascript:;">{{ $t('brand.lg') }}</a>
        <a class="aui-navbar__brand-mini" href="javascript:;">{{ $t('brand.mini') }}</a>
      </h1>
    </div> -->
    <div class="aui-navbar__body">
      <el-menu class="aui-navbar__menu mr-auto" mode="horizontal">
        <el-menu-item index="1" @click="$store.state.sidebarFold = !$store.state.sidebarFold">
          <svg class="icon-svg aui-navbar__icon-menu aui-navbar__icon-menu--switch" aria-hidden="true"><use xlink:href="#icon-outdent"></use></svg>
        </el-menu-item>
        <el-menu-item index="2">
          <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>        
        </el-menu-item>
        <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/> -->
      </el-menu>
      <el-menu class="aui-navbar__menu" mode="horizontal">
        <!-- <el-menu-item index="1">
          <el-dropdown placement="bottom" :show-timeout="0">
            <el-button size="mini">{{ $t('_lang') }}</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(val, key) in i18nMessages" :key="key" @click.native="$i18n.locale = key">{{ val._lang }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item> -->
        <!-- <el-menu-item index="2">
          <a href="javascript:void(0);" target="_blank">
            <svg class="icon-svg aui-navbar__icon-menu" aria-hidden="true"><use xlink:href="#icon-earth"></use></svg>
          </a>
        </el-menu-item> -->
        <el-menu-item index="4" @click="myNoticeRouter()">
          <el-badge :value="$store.state.user.unReadNum>0?$store.state.user.unReadNum:''" :max="99">
            <div><i class="el-icon-bell"></i></div>
          </el-badge>
        </el-menu-item>
        <el-menu-item index="3" @click="fullscreenHandle()">
          <svg class="icon-svg aui-navbar__icon-menu" aria-hidden="true"><use xlink:href="#icon-fullscreen"></use></svg>
        </el-menu-item>
        <el-menu-item index="4" class="aui-navbar__avatar">
          <el-dropdown placement="bottom" :show-timeout="0" trigger="click">
            <span class="el-dropdown-link">
              <img :src="$store.state.user.headUrl || require('@/assets/img/avatar.png')">
              <span>{{ $store.state.user.realName }}</span>
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="userInfoDetailHandle()">个人中心</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="updatePasswordHandle()">{{ $t('updatePassword.title') }}</el-dropdown-item> -->
              <!-- <el-dropdown-item  @click.native="setting">主题设置</el-dropdown-item> -->
              <el-dropdown-item  @click.native="switchAccount">切换账号</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">{{ $t('logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePasswordVisible" ref="updatePassword"></update-password>
    <!-- 账号切换选择 -->
    <el-dialog
      title="选择账号"
      :visible.sync="accountSelectVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      :center="true"
      width="30%"
      :append-to-body="true"
      @close="accountSelectClose"
      >
      <div class="login_user">
        <!-- <p>{{loginUserList.length&&loginUserList[0].userName}}的账号</p> -->
        <div class="user_list" v-for="(item,index) in loginUserList" :key="index"  @click="selectUser(item,index)">
          <el-avatar :size="50" >
            <img :src="item.avatarUrl||require('@/assets/img/default_avatar.png')" alt="">
          </el-avatar>
          <div>
            <p>{{item.userName}}</p>
            <span>{{item.type==0?'平台':item.type==1?'主播':'助手'}}</span>
          </div>
          <!-- <i class="el-icon-check" v-show="active==index"></i> -->
          <i class="el-icon-success" style="font-size: 16px;color: #017FF8;" v-show="active == index"></i>

        </div>
      </div>
      <span slot="footer" class="dialog-footer">
         <el-button size="small" style="    width: 100%;
    height: 50px;
    font-size: 16px;
    background: #017FF8;" type="primary"  @click="goToHome">进入</el-button>
        <!-- <el-button size="small" type="primary" @click="goToHome">进入</el-button> -->
      </span>
    </el-dialog>
  </nav>
</template>

<script>
import { messages } from '@/i18n'
import screenfull from 'screenfull'
import UpdatePassword from './main-navbar-update-password'
import { clearLoginInfo } from '@/utils'
import Breadcrumb from '@/components/Breadcrumb'
export default {
  inject: ['refresh'],
  data () {
    return {
      i18nMessages: messages,
      updatePasswordVisible: false,
      accountSelectVisible: false, //账号切换弹框 
      loginUserList: [],//登录账号列表
      active: 0,//登录账号选中
      selectUserAnchor:{}//选择登录账号
    }
  },
  components: {
    UpdatePassword,
    Breadcrumb
  },
  created () {
    // 未读通知数
    this.getUnReadCount()
  },
  methods: {
    myNoticeRouter () {
      this.$router.push({name:'myMessage-index'})
    },
    getUnReadCount () {
      this.$http.get(`/sys/personalNotice/getUnReadNoticeCount`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$store.state.user.unReadNum = res.data
      }).catch(() => {})
    },
    // 全屏
    fullscreenHandle () {
      if (!screenfull.enabled) {
        return this.$message({
          message: this.$t('fullscreen.prompt'),
          type: 'warning',
          duration: 500
        })
      }
      screenfull.toggle()
    },
    // 修改密码
    updatePasswordHandle () {
      this.updatePasswordVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassword.init()
      })
    },
    // 个人中心
    userInfoDetailHandle () {
      this.$router.push({ name: 'sys-userDetail' })
    },
    // 退出
    logoutHandle () {
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('logout') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.post('/auth/oauth/logout').then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          localStorage.removeItem("curLoginUserId")
          clearLoginInfo()
          this.$router.push({ name: 'login' })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 主题设置
    setting() {
      this.$store.state.tool = !this.$store.state.tool
    },
    // 关闭账号切换弹框
    accountSelectClose() {
      this.active = 0
      this.selectUserAnchor = {}
    },
    // 切换账号
    switchAccount() {
      this.$http.get('/sys/user/getAnchorListWithLogin').then(({ data: res })=>{
        if(res.code!==0){
          return this.$message.error(res.msg)
        }
        if(res.data && res.data.length > 0) {
          this.loginUserList = res.data

          let curLoginId = JSON.parse(localStorage.getItem("curLoginUserId"))
          let curLoginType = this.$store.state.user.loginType
          this.loginUserList.map((item, index) => {
            if(item.anchorId == curLoginId && item.type == curLoginType) {
              this.selectUserAnchor = item
              this.active = index
            }
          })
          // 未匹配到当前登录id
          if(JSON.stringify(this.selectUserAnchor) == "{}") {
            this.selectUserAnchor = this.loginUserList[0]
          }
          this.accountSelectVisible = true
        } else {
          this.$message.info("暂无其他账号")
        }
      })
    },
    // 选择账号
    selectUser(data,index){
      this.selectUserAnchor = data
      this.active = index
    },
    goToHome() {
      if(this.selectUserAnchor.disabledFlg) return this.$message.warning('该账号已被禁用处，无法登录')
      this.$http.post('/sys/user/chooseLoginRole',{anchorId:this.selectUserAnchor.anchorId,type:this.selectUserAnchor.type}).then(({data:res})=>{
        if(res.code !== 0) return this.$message.error(res.msg)

        // 保存当前登录id到本地
        localStorage.setItem("curLoginUserId", JSON.stringify(this.selectUserAnchor.anchorId))
        this.accountSelectVisible = false

        this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name === 'home')
        if(this.$store.state.contentTabsActiveName != 'home') {
          this.$router.push({ name: 'home' })
        }
        setTimeout(() => {
          location.reload()
        }, 500)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login_user{
  height: 300px;
  overflow: auto;
  >p{
    border-bottom: 1px solid #ccc;
    margin: 0;
    padding: 10px 0;
  }
  .user_list{
    display: flex;
    align-items: center;
    border-bottom: 1px solid #F1F2F7;
    padding: 10px 0;
    cursor: pointer;
    position: relative;
    >i{
      position: absolute;
      right: 20px;
      top:30px;
      font-size: 26px;
    }
    >img{
      width: 60px;
      height: 60px;
    }
    >div{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-left: 10px;
      >p{
        margin: 0; 
        padding: 0;
        font-size: 16px;
      }
      >span{
        font-size:14px;
        color: #ccc;
      }
    }
  }
  .active{
    border-bottom:2px solid #20aee5;
    color: #20aee5;
  }
  &::-webkit-scrollbar {
    width:0px;
    height:0px;
  }
}

/deep/ .el-dialog__title{
    font-size: 20px;
font-family: PingFang HK-Semibold, PingFang HK;
font-weight: 600;
position: relative;
color: #111F2C;
&:after {
    content: " ";
    width: 30px;
    height: 4px;
    background: #017FF8;
    position: absolute;
    bottom: -8px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
  }
}
/deep/ .el-badge{
  >div{
    display: flex;
  align-items: center;
  }
  .el-badge__content{
    position: absolute;
    top: -25px;
  }
}
</style>
