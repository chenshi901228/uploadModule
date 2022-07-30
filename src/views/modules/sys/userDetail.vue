<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-row>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="23">
        <el-image
        :preview-src-list="srcList"
        :src="userInfo.headUrl"
        style="width: 200px; height: 200px">
        </el-image>
      </el-col>
      <el-col :span="2">用户姓名：</el-col>
      <el-col :span="22">{{ userInfo.realName }}</el-col>
      <el-col :span="2">手机号码：</el-col>
      <el-col :span="22">{{ userInfo.mobile }}</el-col>
      <el-col :span="2">角色：</el-col>
      <el-col :span="22">{{ userInfo.superAdmin == 1 ? '超级管理员' : (userInfo.roleName || '-') }}</el-col>
      <el-col :span="2">身份证号：</el-col>
      <el-col :span="22">{{ userInfo.idCord || '-' }}</el-col>
      <el-col :span="2">登录账号：</el-col>
      <el-col :span="22">{{ userInfo.mobile}}</el-col>
      <el-col :span="2">登录密码：</el-col>
      <el-col :span="22">****** <el-button
              size="mini"
              type="primary"
              @click="updatePasswordHandle()"
              >修改</el-button
            ></el-col>
      <el-col :span="2">账号状态：</el-col>
      <el-col :span="22">{{ userInfo.status = 1 ? '启用' : '禁用' }}</el-col>
    </el-row>

    <update-password v-if="updatePasswordVisible" ref="updatePassword"></update-password>
  </el-card>

</template>

<script>
import UpdatePassword from '../../main-navbar-update-password-code'
export default {
  data() {
    return {
      updatePasswordVisible: false,
      srcList: [],
      userInfo: {headUrl: ''}
    }
  },
  components: {
    UpdatePassword
  },
  methods: {
    getUserInfo() {
      this.$http
        .get(`/sys/user/${this.$store.state.user.id}`)
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.userInfo = res.data;
            this.srcList = [this.userInfo.headUrl]
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 修改密码
    updatePasswordHandle () {
      this.updatePasswordVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassword.init()
      })
    },
  },
  created(){
    this.getUserInfo();
  },
}
</script>

<style scoped lang="scss">
.el-col-2 {
  text-align: right;
}

.el-col {
  margin-top: 10px;
}

</style>