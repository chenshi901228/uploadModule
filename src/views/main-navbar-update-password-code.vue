<template>
  <el-dialog
    :visible.sync="visible"
    :title="$t('updatePassword.title')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true">
    <el-form size="small" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="240px">
      <el-form-item :label="$t('updatePassword.username')">
        <span>{{ $store.state.user.name }}</span>
      </el-form-item>
      <el-form-item prop="code" label="验证码">
        <el-input style="width: 300px" v-model.trim="dataForm.code" type="text" placeholder="请输入" maxlength="6"></el-input>
        <el-button
          style="margin-left: 20px;"
          type="primary"
          @click.native.prevent="bindforgetSendCode"
          class="bind_code_gain"
          :disabled="disabled"
          >{{ btnText }}</el-button>
      </el-form-item>
      <el-form-item prop="newPassword" label="登录密码">
        <el-input style="width: 300px" v-model.trim="dataForm.newPassword" :placeholder="$t('updatePassword.newPassword')"></el-input>
        <span>（密码由8~16位的字母和数字组成）</span>
      </el-form-item>
      <el-form-item prop="confirmPassword" label="再次输入登录密码">
        <el-input style="width: 300px" v-model.trim="dataForm.confirmPassword"  :placeholder="$t('updatePassword.confirmPassword')"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button size="small" @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button size="small" type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { clearLoginInfo } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      btnText: '获取验证码',
      disabled: false,
      dataForm: {
        password: '',
        newPassword: '',
        confirmPassword: '',
        code: ''
      }
    }
  },
  computed: {
    dataRule () {
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          return callback(new Error(this.$t('updatePassword.validate.confirmPassword')))
        }
        callback()
      }
      // 验证输入的新密码
      var validateNewPassword = (rule, value, callback) => {
        if (value.length > 16 || value.length < 8) {
          return callback(new Error("密码长度必须8~16字符"))
        }else if(!value.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{0,}$/)){
          return callback(new Error("密码组成必须是字母和数字"))
        }
        callback()
      }
      return {
        password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码必填', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateNewPassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http.put('/sys/user/passwordWithCode', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              clearLoginInfo()
              this.$router.replace({ name: 'login' })
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false }),
    
    // 发送验证码
    bindforgetSendCode() {
      //手机号 为空的话
      this.$http.post('/message/sms/sendCodeWithChangePwd',{mobile:this.$store.state.user.name}).then(res=>{
        if(res){
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
            message:"已发送验证码，请查收",
            type:'success'
          });
          this.disabled = true;
          this.btnText = "请稍候...";
          setTimeout(() => {
            this.doLoop(120);
          }, 500);
        } else {
          this.$message({
            message:"验证码发送失败，请重试",
            type:'error'
          });
        }
      })
      
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
