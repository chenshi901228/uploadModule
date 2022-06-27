<template>
  <div class="detalilBox">
    <div class="detalilBox_top">
      <!-- <div>主播头像：</div>
      <div style="display: flex; margin: 0 20px">
        <img :src="
                diaForm.avatarUrl ||
                'https://zego-live-video-back.oss-cn-beijing.aliyuncs.com/liveImages/default_avatar.png'
              " style="width:60px;height:60px" alt="">
        </div> -->
      <div style="color:#ccc">
        <span style="color:#000">验证类型：</span>
        {{ diaForm.updateType==1?'全量修改':diaForm.updateType==2?'修改名称':diaForm.updateType==3?'修改简介':diaForm.updateType==4?'修改头像':diaForm.updateType==5?'背景图片':diaForm.updateType==6?'银行卡信息修改':'-' }}
      </div>
      <div class="info_type">
        <div class="type_title">
          <span>基本信息</span>
        </div>
        <div class="normal_info">
          <div><span>真实姓名：</span>{{ diaForm.realName || "-" }}</div>
          <div>
            <span>手机号码：</span>
            {{ diaForm.phone ||'-' }}
          </div>
          <div>
            <span>身份证号：</span>
            {{ diaForm.idCard || "-" }}
          </div>
          <div>
            <span>性别：</span>
            {{
              diaForm.gender === 0 ? "男" : diaForm.gender === 1 ? "女" : "保密"
            }}
          </div>

          <div>
            <span>是否认证：</span>
            {{ diaForm.legalizeFlg === 1 ? "认证" : "未认证" }}
          </div>
          <div>
            <span>是否是指导师：</span>
            {{ diaForm.tutorFlg === 1 ? "认证" : "未认证" }}
          </div>
          <div>
            <span>主播昵称：</span>
            {{ diaForm.username || '-' }}
          </div>
          <div style="width:100%">
            <span>主播介绍：</span>
            {{diaForm.introduce || '-'}}
          </div>
          <div>
            <span>主播头像：</span>
            <img
              :src="
                diaForm.avatarUrl ||
                'https://zego-live-video-back.oss-cn-beijing.aliyuncs.com/liveImages/default_avatar.png'
              "
              style="width: 60px; height: 60px"
              alt=""
            />
          </div>
          <div>
            <span>主播二维码：</span>
            <img
              :src="
                diaForm.qrCode ||
                'https://zego-live-video-back.oss-cn-beijing.aliyuncs.com/liveImages/default_avatar.png'
              "
              style="width: 60px; height: 60px"
              alt=""
            />
          </div>
        </div>
      </div>
      <div class="info_type">
        <div class="type_title">
          <span>身份认证</span>
        </div>
        <div class="normal_info">
          <div>
            <span>认证类型</span>
            {{diaForm.userType==1?'个人':diaForm.userType==2?'企业':'-'}}
          </div>
        </div>
      </div>
      <div class="info_type">
        <div class="type_title">
          <span>主体信息</span>
        </div>
        <div class="normal_info">
          <div>
            <span>公司名称</span>
            {{diaForm.companyName||'-'}}
          </div>
          <div>
            <span>统一社会信用代码</span>
            {{diaForm.companyCreditCode||'-'}}
          </div>
          <div>
            <span>经营所在地</span>
            {{diaForm.companyAddress||'-'}}
          </div>
          <div>
            <span>营业执照</span>
            {{diaForm.companyBusinessLicense||'-'}}
          </div>
        </div>
      </div>
      <div class="info_type">
        <div class="type_title">
          <span>联系人</span>
        </div>
        <div class="normal_info">
          <div>
            <span>姓名</span>
            {{diaForm.connectName|| '-'}}
          </div>
          <div>
            <span>邮箱</span>
            {{diaForm.connectEmail|| '-'}}
          </div>
          <div>
            <span>手机号码</span>
            {{diaForm.connectPhone|| '-'}}
          </div>
        </div>
      </div>
      <div class="info_type">
        <div class="type_title">
          <span>银行账号</span>
        </div>
        <div class="normal_info">
          <div>
            <span>开户银行</span>
            {{diaForm.bankInfo.depositBank||'-'}}
          </div>
          <div>
            <span>支行名称</span>
            {{diaForm.bankInfo.branchName||'-'}}
          </div>
          <div>
            <span>账户名称</span>
            {{diaForm.bankInfo.accountName||'-'}}
          </div>
          <div>
            <span>银行账号</span>
            {{diaForm.bankInfo.bankAccount||'-'}}
          </div>
          <div>
            <span>开户行所在地</span>
            {{diaForm.bankInfo.address||'-'}}
          </div>
          <div>
            <span>验证金额</span>
            {{diaForm.bankInfo.attestAmount}}
          </div>
        </div>
      </div>
      <div>
        <span>备注：</span>
        <el-input
          show-word-limit
          type="textarea"
          maxlength="100"
          placeholder="请输入，可不填"
          v-model="diaForm.remark"
          :disabled="diaForm.status != 0"
        />
      </div>
    </div>

    <div class="detalilBox_bottom">
      <el-button
        size="small"
        type=""
        @click="updateApplyInfoStatus(-1)"
        v-if="diaForm.status === 0"
        >驳回</el-button
      >
      <el-button
        size="small"
        type="primary"
        @click="updateApplyInfoStatus(1)"
        v-if="diaForm.status === 0"
        >通过</el-button
      >
    </div>
  </div>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
export default {
  mixins: [mixinViewModule],
  name: "complainsRecords_detail",
  data() {
    return {
      userId: "",
      diaForm: {},
      mixinViewModuleOptions: {
        createdIsNeed: false, // 此页面是否在创建时，调用查询数据列表接口？
      },
    };
  },
  activated(){
    this.$http.get(`/sys/anchor/applyInfo/${this.$route.query.id}`).then(res=>{
      if(res.data.code===0){
        this.diaForm = res.data.data
      }
    })
  },
  methods: {
    // 审核
    updateApplyInfoStatus(status) {
      this.$confirm(
        `是否执行 [${status == -1 ? "拒绝" : "同意"}] 操作`,
        this.$t("prompt.title"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(() => {
          this.$http["put"]("/sys/anchor/applyInfo/", {
            id: this.diaForm.id,
            status,
            remark: this.diaForm.remark,
          })
            .then(({ data: res }) => {
              if (res.code != 0) {
                return this.$message.error(res.msg);
              }
              this.$message.success("操作成功");
              this.closeCurrentTab();
              this.$bus.$emit("change");
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.detalilBox {
  height: 100%;
  background: #fff;
  min-height: calc(calc(100vh - 50px - 38px - 30px));
  padding: 20px 30px;
  .detalilBox_top {
    width: 100%;
    height: 100%;
    overflow: auto;
    word-break: break-all;
    .info_type {
      width: 100%;
      margin-top: 10px;
      .type_title {
        position: relative;
        line-height: 16px;
        padding-left: 10px;
        &::before {
          display: block;
          content: "";
          position: absolute;
          width: 5px;
          height: 16px;
          background-color: #409eff;
          left: 0;
          top: 0;
        }
      }
      .normal_info {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        > div {
          width: 50%;
          display: flex;
          margin: 5px 0 10px;
          color: #ccc;
          > span {
            width: 120px;
            text-align: right;
            margin: 0 10px;
            color: #000;
          }
        }
      }
    }
  }
  .detalilBox_bottom {
    height: 40px;
    text-align: right;
    padding: 0 20px;
  }
}
.tag {
  width: 150px;
  text-align: center;
  background: #ccc;
  margin-right: 20px;
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
}
</style>