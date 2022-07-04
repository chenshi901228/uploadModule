<template>
  <div class="aui-wrapper aui-page__login">
    <div class="aui-content__wrapper">
      <main class="aui-content">
        <div class="login-header">
          <h2 class="login-brand">{{ $t('brand.lg') }}</h2>
        </div>
        <div class="login-body">
          <h3 class="login-title">{{ $t('login.title') }}</h3>
          <el-form v-show="loginType" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" status-icon>
            <!-- <el-form-item>
              <el-select v-model="$i18n.locale" class="w-percent-100">
                <el-option v-for="(val, key) in i18nMessages" :key="key" :label="val._lang" :value="key"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item prop="username">
              <el-input v-model="dataForm.username" :placeholder="$t('login.username')">
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-user"></use></svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" :placeholder="$t('login.password')">
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-lock"></use></svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" :placeholder="$t('login.captcha')">
                    <span slot="prefix" class="el-input__icon">
                      <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-safetycertificate"></use></svg>
                    </span>
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dataFormSubmitHandle()" class="w-percent-100">{{ $t('login.title') }}</el-button>
            </el-form-item>
          </el-form>
          <el-form v-show="!loginType" :model="dataFormPhone" :rules="dataRulephone" ref="dataFormPhone" @keyup.enter.native="dataFormSubmitHandle()" status-icon>
            <el-form-item prop="phone">
              <el-input v-model="dataFormPhone.phone" placeholder="请输入手机号">
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-user"></use></svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="verifyCode">
              <div class="bind_code">
                <el-input
                  class="bind_code_input code"
                  v-model="dataFormPhone.verifyCode"
                  type="text"
                  placeholder="请输入验证码"
                >
                  <span slot="prefix" class="el-input__icon">
                    <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-lock"></use></svg>
                  </span>
                </el-input>
                <el-button
                  @click.native.prevent="bindforgetSendCode"
                  class="bind_code_gain"
                  :disabled="disabled"
                  >{{ btnText }}</el-button
                >
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dataFormSubmitHandle()" class="w-percent-100">{{ $t('login.title') }}</el-button>
            </el-form-item>
          </el-form>
          <span style="color:#66b1ff;cursor:pointer;" @click="loginType=!loginType">{{loginType?'手机号码登录':'密码登录'}}</span>
        </div>
        <div class="login-footer">
          <p>
            <a href="javascript:void(0);" target="_blank">{{ $t('login.demo') }}</a>
          </p>
          <p><a href="javascript:void(0);" target="_blank">{{ $t('login.copyright') }}</a>2022</p>
        </div>
      </main>
    </div>
    <el-dialog
      title="选择账号"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :center="true"
      width="30%"
      >
      <div class="login_user">
        <p>{{loginUserList.length&&loginUserList[0].userName}}的账号</p>
        <div class="user_list" v-for="(item,index) in loginUserList" :key="index" :class="active==index?'active':''" @click="selectUser(item,index)">
          <img :src="item.avatarUrl||require('@/assets/img/default_avatar.png')" alt="">
          <div>
            <p>{{item.userName}}</p>
            <span>{{item.type==1?'主播':'助手'}}</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="goToHome">进入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import debounce from 'lodash/debounce'
import { messages } from '@/i18n'
import { getUUID } from '@/utils'
export default {
  data () {
    return {
      i18nMessages: messages,
      captchaPath: '',
      dataForm: {
        username: '',
        password: '',
        uuid: '',
        captcha: '',
        grant_type: 'password',
      },
      dataFormPhone:{
        grant_type: 'phone_verify_code',
        phone:'',
        verifyCode:''
      },
      loginType:true,//true:账号密码 false：手机号验证
      btnText: "发送验证码",
      disabled: false,
      loginUserList:[],//登录账号列表
      dialogVisible:false,//登录账号选择弹窗
      active:0,//登录账号选中
      selectUserAnchorId:''//选择登录账号ID
    }
  },
  computed: {
    dataRule () {
      return {
        username: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        phone:[
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
      }
    },
    dataRulephone(){
      return {
        verifyCode: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        phone:[
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
      }
    }
  },
  created () {
    this.getCaptcha()
  },
  methods: {
    selectUser(data,index){
      this.selectUserAnchorId = data.anchorId
      this.active = index
    },
    goToHome(){ //选择角色进入
      this.$http.post('/sys/user/chooseLoginRole',{anchorId:this.selectUserAnchorId}).then(({data:res})=>{
        if(res.code!==0){
          return this.$message.error(res.msg)
        }
        this.dialogVisible = false
        this.$router.replace({ name: 'home' })
      })
    },
    // 获取验证码
    getCaptcha () {
      this.dataForm.uuid = getUUID()
      this.captchaPath = `${window.SITE_CONFIG['apiURL']}/auth/captcha?uuid=${this.dataForm.uuid}`
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      if(this.loginType){
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false
          }
          this.$http.post('/auth/oauth/token', this.dataForm,
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic cmVucmVuaW86cmVucmVuaW8='
              }
            }
          ).then(({ data: res }) => {
            if (res.code !== 0) {
              this.getCaptcha()
              return this.$message.error(res.msg)
            }
            Cookies.set('access_token', res.access_token)
            this.$http.get('/sys/user/getAnchorListWithLogin').then(({ data: res })=>{
              console.log(res)
              if(res.code!==0){
                return this.$message.error(res.msg)
              }
              this.loginUserList = res.data
              this.dialogVisible = true
              this.selectUserAnchorId =this.loginUserList[0].anchorId 
            })
          }).catch(() => {})
        })
      }else{
        this.$refs['dataFormPhone'].validate((valid) => {
          if (!valid) {
            return false
          }
          this.$http.post('/auth/oauth/token', this.dataFormPhone,
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic cmVucmVuaW86cmVucmVuaW8='
              }
            }
          ).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            Cookies.set('access_token', res.access_token)
            this.$http.get('/sys/user/getAnchorListWithLogin').then(({ data: res })=>{
              console.log(res)
              if(res.code!==0){
                return this.$message.error(res.msg)
              }
              this.loginUserList = res.data
              this.dialogVisible = true
              this.selectUserAnchorId =this.loginUserList[0].anchorId 
            })
          }).catch(() => {})
        })
      }
    }, 1000, { 'leading': true, 'trailing': false }),
    // 发送验证码
    bindforgetSendCode() {
      //手机号 为空的话
      this.$refs.dataFormPhone.validateField("phone", (errorMessage) => {
        if (!errorMessage) {
          this.$http.post('/message/sms/sendCodeWithLogin',{mobile:this.dataFormPhone.phone}).then(res=>{
            if(res){
              this.$message({
                message:"已发送验证码，请查收",
                type:'success'
              });
              this.disabled = true;
              this.btnText = "请稍候...";
              setTimeout(() => {
                this.doLoop(60);
              }, 500);
            }
          })
        } else {
          return false;
        }
      });
    },
    // 手机验证码的倒计时
    doLoop: function (seconds) {
      seconds = seconds ? seconds : 60;
      this.btnText = seconds + "s后获取";
      let countdown = setInterval(() => {
        if (seconds > 0) {
          this.btnText = seconds + "s后获取";
          --seconds;
        } else {
          this.btnText = "获取验证码";
          this.disabled = false;
          clearInterval(countdown);
        }
      }, 1000);
    },
  }
}
</script>
<style scoped lang="scss">
.bind_code {
  position: relative;
  .el-input__inner {
    width: 328px;
    height: 44px;
    background: #f7f7f7;
    border-radius: 4px;
    border: 1px solid #e4e4e4;
    outline: none;
    padding: 0 100px 0 10px;
  }
  .code /deep/.el-input__suffix {
    right: 97px;
  }
  .el-button {
    border: 0;
    background: none;
    padding: 0;
    border-radius: 0;
  }
  .bind_code_gain {
    position: absolute;
    top: calc(50% - 9px);
    right: 10px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #20aee5;
    line-height: 18px;
    cursor: pointer;
    padding-left: 10px;
    border-left: 1px solid #d8d8d8;
  }
} 
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
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
    cursor: pointer;
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
</style>
