<template>
  <div class="aui-wrapper aui-page__login">
    <div class="aui-content__wrapper">
      <main class="aui-content">
        <div class="login-header">
          <img src="../../assets/img/loginIcon.png" alt="">
          <h2 class="login-brand">{{ $t('brand.lg') }}</h2>
        </div>
    
       
      </main>
          <div class="login-body">
          <div style="margin:50px;display: flex;justify-content: space-between;align-items: center;">
            <div :style="{ color: !loginType ? '#111F2C' : '#707980', fontWeight: !loginType ? '600' : '400' }"
              :class="!loginType ? 'changedBtn' : ''" @click="tabChange"
              style="color: #707980;cursor:pointer;font-size: 20px;">验证码登录</div>
            <div :style="{ color: loginType ? '#111F2C' : '#707980', fontWeight: loginType ? '600' : '400' }"
              :class="loginType ? 'changedBtn' : ''" @click="tabChange"
              style="color: #707980;cursor:pointer;font-size: 20px;">密码登录</div>
          </div>
          <!-- <span style="color:#66b1ff;cursor:pointer;" @click="loginType=!loginType">{{loginType?'手机号码登录':'密码登录'}}</span> -->
          <el-form style="margin:0 30px" v-show="loginType" :model="dataForm" :rules="dataRule" ref="dataForm"
            @keyup.enter.native="dataFormSubmitHandle()" status-icon>
            <!-- <el-form-item>
              <el-select v-model="$i18n.locale" class="w-percent-100">
                <el-option v-for="(val, key) in i18nMessages" :key="key" :label="val._lang" :value="key"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item prop="username">
              <el-input v-model="dataForm.username" :placeholder="$t('login.username')">
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true">
                    <use xlink:href="#icon-user"></use>
                  </svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" show-password :placeholder="$t('login.password')">
                <span slot="prefix" class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true">
                    <use xlink:href="#icon-lock"></use>
                  </svg>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" :placeholder="$t('login.captcha')">
                    <span slot="prefix" class="el-input__icon">
                      <svg class="icon-svg" aria-hidden="true">
                        <use xlink:href="#icon-safetycertificate"></use>
                      </svg>
                    </span>
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="loading" :loading="loading" @click="dataFormSubmitHandle()" class="w-percent-100">{{ $t('login.title') }}
              </el-button>
            </el-form-item>
          </el-form>
          <el-form style="margin:0 30px" v-show="!loginType" :model="dataFormPhone" :rules="dataRulephone"
            ref="dataFormPhone" @keyup.enter.native="dataFormSubmitHandle()" status-icon>
            <el-form-item prop="phone">
              <el-input v-model="dataFormPhone.phone" placeholder="请输入手机号">
                <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="verifyCode">
              <div class="bind_code">
                <el-input class="bind_code_input code" v-model="dataFormPhone.verifyCode" type="text"
                  placeholder="请输入验证码">
                  <span slot="prefix" class="el-input__icon">
                    <svg class="icon-svg" aria-hidden="true">
                      <use xlink:href="#icon-lock"></use>
                    </svg>
                  </span>
                </el-input>
                <el-button @click.native.prevent="bindforgetSendCode" class="bind_code_gain" :disabled="disabled || loading">{{
                    btnText
                }}</el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="loading" :loading="loading" type="primary" @click="dataFormSubmitHandle()" class="w-percent-100">{{ $t('login.title') }}
              </el-button>
            </el-form-item>
          </el-form>

        </div>
    </div>
    <el-dialog title="选择账号" :modal="false" :visible.sync="dialogVisible" 
      top="260px" :close-on-click-modal="false" :close-on-press-escape="false"
      :show-close="false" :center="true" width="350px">
      <div class="login_user">
        <div class="user_list" v-for="(item, index) in loginUserList" :key="index"
          :class="active == index ? 'active' : ''" @click="selectUser(item, index)">
          <!-- <img :src="item.avatarUrl || require('@/assets/img/default_avatar.png')" alt=""> -->
          <el-avatar :size="50" >
            <img :src="item.avatarUrl || require('@/assets/img/default_avatar.png')" />
          </el-avatar>
          <div>
            <p>{{ item.userName }}</p>
            <span>{{ item.type == 0 ? '平台' : item.type == 1 ? '主播' : '助手' }}</span>
          </div>
          <i class="el-icon-success" style="font-size: 16px;color: #017FF8;" v-show="active == index"></i>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" style="    width: 100%;
    height: 50px;
    font-size: 16px;
    background: #017FF8;" type="primary" :disabled="goToHomeLoading" :loading="goToHomeLoading" @click="goToHome">进入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import debounce from 'lodash/debounce'
import { messages } from '@/i18n'
import { getUUID } from '@/utils'
import fansLevelAddOrUpdateVue from '../modules/basicManagement/fansLevel-add-or-update.vue'
export default {
  data() {
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
      dataFormPhone: {
        grant_type: 'phone_verify_code',
        phone: '',
        verifyCode: ''
      },
      loginType: true,//true:账号密码 false：手机号验证
      btnText: "发送验证码",
      disabled: false,
      loginUserList: [],//登录账号列表
      dialogVisible: false,//登录账号选择弹窗
      active: 0,//登录账号选中
      selectUserAnchor: {},//选择登录账号
      loading: false, //登录loading
      goToHomeLoading: false, //选择账号进入loading
    }
  },
  computed: {
    dataRule() {
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
        phone: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
      }
    },
    dataRulephone() {
      return {
        verifyCode: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        phone: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.getCaptcha()
  },
  methods: {
    selectUser(data, index) {
      this.selectUserAnchor = data
      this.active = index
    },
    // 切换登录方式
    tabChange() {
      if(this.loading) return
      this.loginType = !this.loginType
    },
    goToHome() { //选择角色进入
      if(this.selectUserAnchor.disabledFlg) return this.$message.warning('该账号已被禁用处，无法登录')
      this.goToHomeLoading = true
      this.$http.post('/sys/user/chooseLoginRole', { anchorId: this.selectUserAnchor.anchorId, type: this.selectUserAnchor.type }).then(({ data: res }) => {
        this.goToHomeLoading = false
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        // 保存当前登录id到本地
        localStorage.setItem("curLoginUserId", JSON.stringify(this.selectUserAnchor.anchorId))

        this.dialogVisible = false
        this.$router.replace({ name: 'home' })
      }).catch((err) => {
        this.goToHomeLoading = true
        this.$message.error(JSON.stringify(err && err.message));
      })
    },
    // 获取验证码
    getCaptcha() {
      this.dataForm.uuid = getUUID()
      this.captchaPath = `${window.SITE_CONFIG['apiURL']}/auth/captcha?uuid=${this.dataForm.uuid}`
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      if(this.loading || this.dialogVisible) return
      if (this.loginType) { //账号密码登录
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false
          }
          this.loading = true
          this.$http.post('/auth/oauth/token', this.dataForm,
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic cmVucmVuaW86cmVucmVuaW8='
              }
            }
          ).then(({ data: res }) => {
            if (res.code !== 0) {
              this.loading = false
              this.getCaptcha()
              return this.$message.error(res.msg)
            }
            Cookies.set('access_token', res.access_token)
            this.$http.get('/sys/user/getAnchorListWithLogin').then(({ data: res }) => {
              this.loading = false
              if (res.code !== 0) {
                return this.$message.error(res.msg)
              }
              if (res.data && res.data.length > 0) {
                this.loginUserList = res.data
                this.dialogVisible = true
                this.selectUserAnchor = this.loginUserList[0]
              } else {
                this.$router.replace({ name: 'home' })
              }

            }).catch((err) => {
              this.loading = false
              this.$message.error(JSON.stringify(err && err.message));
            })
          }).catch((err) => {
            this.loading = false
            this.$message.error(JSON.stringify(err && err.message));
          })
        })
      } else { //验证码登录
        this.$refs['dataFormPhone'].validate((valid) => {
          if (!valid) {
            return false
          }
          this.loading = true
          this.$http.post('/auth/oauth/token', this.dataFormPhone,
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic cmVucmVuaW86cmVucmVuaW8='
              }
            }
          ).then(({ data: res }) => {
            if (res.code !== 0) {
              this.loading = false
              return this.$message.error(res.msg)
            }
            Cookies.set('access_token', res.access_token)
            this.$http.get('/sys/user/getAnchorListWithLogin').then(({ data: res }) => {
              this.loading = false
              if (res.code !== 0) {
                return this.$message.error(res.msg)
              }
              if (res.data && res.data.length > 0) {
                this.loginUserList = res.data
                this.dialogVisible = true
                this.selectUserAnchor = this.loginUserList[0]
              } else {
                this.$router.replace({ name: 'home' })
              }
            }).catch((err) => {
              this.loading = false
              this.$message.error(JSON.stringify(err && err.message));
            })
          }).catch((err) => {
            this.loading = false
            this.$message.error(JSON.stringify(err && err.message));
          })
        })
      }
    }, 1000, { 'leading': true, 'trailing': false }),
    // 发送验证码
    bindforgetSendCode() {
      //手机号 为空的话
      this.$refs.dataFormPhone.validateField("phone", (errorMessage) => {
        if (!errorMessage) {
          this.loading=true
          this.$http.post('/message/sms/sendCodeWithLogin', { mobile: this.dataFormPhone.phone }).then(res => {
            if (res) {
              if (res.data.code !== 0) {
                if(res.data.code == 100003003) {
                  this.$alert('今日短信验证码已达上限10次，请拨打400-092-1288，联系客服获取验证码', '提示', {
                    confirmButtonText: '确定',
                  })
                  return
                }
                return this.$message.error(res.data.msg)
              }
              this.$message({
                message: "已发送验证码，请查收",
                type: 'success'
              });
              this.disabled = true;
              this.btnText = "请稍候...";
              setTimeout(() => {
                this.doLoop(60);
                this.loading=false
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

.login_user {
  // height: 300px;
  // overflow: auto;

  >p {
    border-bottom: 1px solid #ccc;
    margin: 0;
    padding: 10px 0;
  }

  .user_list {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #F1F2F7;
    padding: 15px 0;
    cursor: pointer;
    position: relative;

    >i {
      position: absolute;
      right: 20px;
      top: 30px;
      font-size: 26px;
    }

    >img {
      width: 60px;
      height: 60px;
    }

    >div {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-left: 10px;

      >p {
        margin: 0;
        padding: 0;
        font-size: 16px;
      }

      >span {
        font-size: 14px;
        color: #ccc;
      }
    }
  }

  .active {
    // border-bottom: 2px solid #20aee5;
    // color: #20aee5;
  }

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}

.changedBtn {
  position: relative;

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
/deep/ .el-dialog--center .el-dialog__body {
    text-align: initial;
    padding: 0 30px;
}
/deep/ .el-dialog__footer{
    padding: 30px;
}
/deep/ .el-dialog__header{
    padding: 40px;
}
/deep/ .el-dialog {
  
    position: absolute;
    right: 23.1%;
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
</style>
