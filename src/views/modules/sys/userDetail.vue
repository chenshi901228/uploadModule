<template>
 
  <div style="position: absolute;left: 10px;right: 10px;background: #fff;top: 10px;bottom: 10px;">
    <div class="left">
      <div class="title">个人中心</div>
      <div class="avatar">
        <el-avatar :size="110" src="https://empty" @error="errorHandler">
          <img :src="userInfo.headUrl" />
        </el-avatar>
      </div>
      <div class="aside">
        <div><i class="el-icon-user-solid" style="margin-right:5px"></i> 用户姓名</div>
        <div>{{ userInfo.realName }}</div>
      </div>
      <div class="aside">
        <div><i class="el-icon-mobile-phone" style="margin-right:5px"></i>手机号码</div>
        <div>{{ userInfo.mobile }}</div>
      </div>
      <div class="aside">
        <div><i class="el-icon-s-check" style="margin-right:5px"></i>角色</div>
        <div>{{ userInfo.superAdmin == 1 ? '超级管理员' : (userInfo.roleName || '-') }}</div>
      </div>
    </div>
    <div class="right">
      <div class="title">基本资料</div>
      <div class="aside" style="margin-top: 30px;">
        <div style="margin-right: 50px;"> 身份证号</div>
        <div>{{ enCodeIdCard(userInfo.idCard) || '-' }}</div>
      </div>
      <div class="aside">
        <div style="margin-right: 50px;"> 登录账号</div>
        <div>{{ userInfo.mobile }}</div>
      </div>
      <div class="aside">
        <div style="margin-right: 50px;"> 登录密码</div>
        <div>****** <el-button size="mini" type="primary" style="margin:0 10px" @click="updatePasswordHandle()">修改</el-button>
        </div>
      </div>
      <div class="aside">
        <div style="margin-right: 50px;"> 账号状态</div>
        <div>{{  userInfo.status = 1 ? '启用' : '禁用' }}</div>
      </div>
    </div>
    <update-password v-if="updatePasswordVisible" ref="updatePassword"></update-password>

  </div>



</template>

<script>
import { enCodeIdCard } from "@/utils";
import UpdatePassword from '../../main-navbar-update-password-code'
export default {
  data() {
    return {
      updatePasswordVisible: false,
      srcList: [],
      userInfo: { headUrl: '' }
    }
  },
  components: {
    UpdatePassword
  },
  methods: {
    // 身份证号码加密
    enCodeIdCard(val) {
      return enCodeIdCard(val)
    },
    getUserInfo() {
      this.$http
        .get(`/sys/user/infoByPersonalCenter`)
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
    updatePasswordHandle() {
      this.updatePasswordVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassword.init()
      })
    },
     errorHandler() {
        return true
      }
  },
  created() {
    this.getUserInfo();
  },
}
</script>

<style scoped lang="scss">
.left {
  position: absolute;
  left: 0;
  width: 450px;
  height: 630px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 1px rgba(17, 17, 17, 0.185);



  .avatar {
    text-align: center;
    padding-top: 40px;
  }

  .aside {
    height: 50px;
    border-bottom: 1px solid #EBEEF5;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    align-items: center;
    font-size: 14px;
    color: #2B2C2E;
    margin: 0 20px;
  }
}

.right {
  position: absolute;
  right: 0;
  left: 470px;
  height: 333px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 1px rgba(17, 17, 17, 0.185);

  .aside {
    height: 50px;
    box-sizing: border-box;
    display: flex;
    font-size: 13px;
    color: #2B2C2E;
    margin: 0 20px;

  }
}

.title {
  height: 70px;
  border-bottom: 1px solid #EBEEF5;
  box-sizing: border-box;
  line-height: 70px;
  padding: 0 20px;
  font-size: 20px;
  font-weight: bold;
}

.el-col-2 {
  text-align: right;
}

.el-col {
  margin-top: 10px;
}
</style>