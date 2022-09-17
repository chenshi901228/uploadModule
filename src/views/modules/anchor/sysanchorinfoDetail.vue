<template>
  <div class="detalilBox">
    <div class="detalilBox_all">
      <!-- <div>主播头像：</div>
      <div style="display: flex; margin: 0 20px">
        <img :src="
                diaForm.avatarUrl ||
                'https://zego-live-video-back.oss-cn-beijing.aliyuncs.com/liveImages/default_avatar.png'
              " style="width:60px;height:60px" alt="">
        </div> -->
      <div class="detalilBox_top" style="display:flex;" >
        <div style="border:1px solid #E7EBF5;width: calc(100% - 120px);">
          <!-- <span style="color:#000">验证类型：</span>
          {{ diaForm.updateType==1?'主播申请':diaForm.updateType==2?'账户信息':'-' }} -->
          <el-descriptions class="margin-top" :column="2" size="small" border>
            <el-descriptions-item>
              <template slot="label" style="width:100px">
                验证类型
              </template>
              <span style="padding:0 10px">{{ diaForm.updateType==1?'主播申请':diaForm.updateType==2?'账户信息':'-' }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="info_type detalilBox_top" style="margin:20px 0;display: flex;justify-content: space-between;flex-wrap: wrap;    padding: 10px 80px 10px 10px;">
        <!-- <div class="type_title">
          <span>基本信息</span>
        </div> -->
        <div
          style="height: 50px;width:100%;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 15px;border-bottom:1px solid #EBEEF5;">
          基本信息
        </div>
        <div class="normal_info">

          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right;">真实姓名</div>
            <div style="display: flex; margin: 0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.realName" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>

          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right;width:100px">手机号码</div>
            <div style="display: flex; margin: 0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.phone" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>

          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right;">身份证号</div>
            <div style="display: flex; margin: 0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.idCard" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
          <!-- <div>
            <span>性别：</span>
            {{
              diaForm.gender === 0 ? "男" : diaForm.gender === 1 ? "女" : "保密"
            }}
          </div> -->
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right; width:100px">性别</div>
            <div style="display: flex; margin: 0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.gender" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>

          <!-- <div>
            <span>是否认证：</span>
            {{ diaForm.legalizeFlg === 1 ? "认证" : "未认证" }}
          </div> -->
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right;">是否认证</div>
            <div style="display: flex; margin: 0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.legalizeFlg" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
          <!-- <div>
            <span>是否是指导师：</span>
            {{ diaForm.tutorFlg === 1 ? "是" : "否" }}
          </div> -->
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right; width:100px">是否是指导师</div>
            <div style="display: flex; margin: 0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.tutorFlg" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
          <!-- <div>
            <span>主播昵称：</span>
            {{ diaForm.username || '-' }}
          </div> -->
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right;">主播昵称</div>
            <div style="display: flex; margin: 0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.username" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
          <!-- <div style="width:100%">
            <span>主播介绍：</span>
            {{diaForm.introduce || '-'}}
          </div> -->
          <div style="display:flex;width: 100%;align-items: center;margin: 10px 0;">
            <div style="text-align: right;">主播简介</div>
            <div style="display: flex; margin: 0 10px ; width: calc(100% - 100px );">
              <el-input :rows='2' type="textarea" v-model="diaForm.introduce" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
          <div style="display:flex;width: 48%">
            <!-- <span>主播头像：</span> -->
            <div style="text-align: right;margin-right:10px">主播头像</div>
            <el-image 
              style="width: 120px; height: 120px"
              :src="diaForm.avatarUrl" 
              :preview-src-list="[diaForm.avatarUrl]">
              <div slot="error" class="image-slot">
                <span v-if="diaForm.avatarUrl">加载失败</span>
                <span v-else>暂无图片</span>
              </div>
            </el-image>
          </div>
          <div style="display:flex;width: 48%">
            <!-- <span>主播二维码：</span> -->
            <div style="text-align: right;margin-right:30px">主播二维码</div>
            <el-image 
              style="width: 120px; height: 120px"
              :src="diaForm.qrCode" 
              :preview-src-list="[diaForm.qrCode]">
              <div slot="error" class="image-slot">
                <span v-if="diaForm.qrCode">加载失败</span>
                <span v-else>暂无图片</span>
              </div>
            </el-image>
          </div>
        </div>
      </div>
      <!-- <div class="info_type">
        <div class="type_title">
          <span>身份认证</span>
        </div>
        <div class="normal_info">
          <div>
            <span>认证类型</span>
            {{diaForm.userType==1?'个人':diaForm.userType==2?'企业':'-'}}
          </div>
        </div>
      </div> -->
      <div class="info_type detalilBox_top" style="margin:20px 0;display: flex;justify-content: space-between;flex-wrap: wrap;    padding: 10px 80px 10px 10px;">
        <div
          style="height: 50px;width:100%;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 15px;border-bottom:1px solid #EBEEF5;">
          身份认证
        </div>
        <div style="display:flex;width: 48%;align-items: center;">
          <div style="text-align: right;">认证类型</div>
          <div style="display: flex; margin:0 10px ; width: calc(100% - 100px );">
            <el-input v-model="diaForm.userType" disabled style="border-radius:5px" size="small"></el-input>
          </div>
        </div>
      </div>

      <div v-if="diaForm.userType==2 || diaForm.userType=='企业'" class="info_type detalilBox_top" style="margin:20px 0;display: flex;justify-content: space-between;flex-wrap: wrap;    padding: 10px 80px 10px 10px;">
        <div
          style="height: 50px;width:100%;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 15px;border-bottom:1px solid #EBEEF5;">
          主体信息
        </div>
        <div class="normal_info">
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right;">公司名称</div>
            <div style="display: flex; margin:0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.companyName " disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>

          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right;width:140px">统一社会信用代码</div>
            <div style="display: flex; margin:0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.companyCreditCode" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>

          <div style="display:flex;width: 48%">
            <!-- <span>主播二维码：</span> -->
            <div style="text-align: right;margin-right:30px">营业执照</div>
            <el-image 
              style="max-width:120px;max-height:120px"
              :src="diaForm.companyBusinessLicense" 
              :preview-src-list="[diaForm.companyBusinessLicense]">
            </el-image>
          </div>

          <div style="display:flex;width: 48%">
            <div style="text-align: right;width:140px">经营所在地</div>
            <div style="display: flex; margin:0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.companyAddress" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
        </div>
      </div>

      <div v-if="diaForm.userType==2 || diaForm.userType=='企业'" class="info_type detalilBox_top" style="margin:20px 0;display: flex;justify-content: space-between;flex-wrap: wrap;    padding: 10px 80px 10px 10px;">
        <div
          style="height: 50px;width:100%;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 15px;border-bottom:1px solid #EBEEF5;">
          联系人
        </div>
        <div class="normal_info">
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right;width:50px">姓名</div>
            <div style="display: flex; margin:0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.connectName " disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right;width:140px">手机号码</div>
            <div style="display: flex; margin:0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.connectPhone " disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right;width:50px">邮箱</div>
            <div style="display: flex; margin:0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.connectEmail " disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
        </div>
      </div>


      <!-- <div class="info_type" v-if="diaForm.userType==2">
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
      </div> -->

      <div class="info_type detalilBox_top" style="margin:20px 0;display: flex;justify-content: space-between;flex-wrap: wrap;    padding: 10px 80px 10px 10px;">
        <div
          style="height: 50px;width:100%;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 15px;border-bottom:1px solid #EBEEF5;">
          银行账号
        </div>
        <div class="normal_info">
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right">开户银行</div>
            <div style="display: flex; margin:0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.bankInfo.depositBank" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right;width:140px">支行名称</div>
            <div style="display: flex; margin:0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.bankInfo.branchName " disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right">账户名称</div>
            <div style="display: flex; margin:0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.bankInfo.accountName" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right;width:140px">开户行所在地</div>
            <div style="display: flex; margin:0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.bankInfo.address" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right">银行账号</div>
            <div style="display: flex; margin:0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.bankInfo.bankAccount" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
          <div style="display:flex;width: 48%;align-items: center;">
            <div style="text-align: right;width:140px">验证金额</div>
            <div style="display: flex; margin:0 10px ; width: calc(100% - 100px );">
              <el-input v-model="diaForm.bankInfo.attestAmount" disabled style="border-radius:5px" size="small"></el-input>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="info_type">
        <div class="type_title">
          <span>银行账号</span>
        </div>
        <div class="normal_info">
          <div>
            <span>开户银行</span>
            {{diaForm.bankInfo&&diaForm.bankInfo.depositBank||'-'}}
          </div>
          <div>
            <span>支行名称</span>
            {{diaForm.bankInfo&&diaForm.bankInfo.branchName||'-'}}
          </div>
          <div>
            <span>账户名称</span>
            {{diaForm.bankInfo&&diaForm.bankInfo.accountName||'-'}}
          </div>
          <div>
            <span>银行账号</span>
            {{diaForm.bankInfo&&diaForm.bankInfo.bankAccount||'-'}}
          </div>
          <div>
            <span>开户行所在地</span>
            {{diaForm.bankInfo&&diaForm.bankInfo.address||'-'}}
          </div>
          <div v-if="diaForm.userType==2">
            <span>验证金额</span>
            {{diaForm.bankInfo&&diaForm.bankInfo.attestAmount || 0}}
          </div>
        </div>
      </div> -->

      <div v-if="diaForm.userType==2 || diaForm.userType=='企业'" class="info_type detalilBox_top" style="margin:20px 0;display: flex;justify-content: space-between;flex-wrap: wrap;    padding: 10px 80px 10px 10px;">
        <div v-if="diaForm.status != 0">
          <span>备注：{{diaForm.remark}}</span>
        </div>
        <div v-if="diaForm.status == 0" style="display:flex;width:100%">
          <div style="text-align: right;width:60px;margin-right:10px">备注</div>
          <el-input
            show-word-limit
            type="textarea"
            maxlength="100"
            placeholder="请输入，可不填"
            v-model="diaForm.remark"
          />
        </div>
      </div>
      
    </div>

    <div class="detalilBox_bottom">
      <el-button
        size="small"
        type="primary"
        @click="updateApplyInfoStatus(1)"
        v-if="diaForm.status === 0"
        >通过</el-button
      >
      <el-button
        size="small"
        type=""
        @click="updateApplyInfoStatus(-1)"
        v-if="diaForm.status === 0"
        >驳回</el-button
      >
      
    </div>

    <!-- 审核状态图片 -->
    <img v-if="statusImg" class="statusImg" :src="statusImg" alt="">
  </div>
</template>

<script>
import commonModule from "@/mixins/common-module";
export default {
  mixins: [commonModule],
  name: "complainsRecords_detail",
  data() {
    return {
      userId: "",
      diaForm: {
        remark:''
      },
    };
  },
  activated(){
    this.$http.get(`/sys/anchor/applyInfo/${this.$route.query.id}`).then(res=>{
      if(res.data.code===0){
        
        if(res.data.data.gender == 0){
          res.data.data.gender = '男'
        }else if(res.data.data.gender == 1){
          res.data.data.gender = '女'
        }else{
          res.data.data.gender = '保密'
        }

        if(res.data.data.legalizeFlg == 1){
          res.data.data.legalizeFlg = '是'
        }else{
          res.data.data.legalizeFlg = '否'
        }

        if(res.data.data.tutorFlg == 1){
          res.data.data.tutorFlg = '是'
        }else{
          res.data.data.tutorFlg = '否'
        }

        if(res.data.data.userType == 1){
          res.data.data.userType = '个人'
        }else if(res.data.data.userType == 2){
          res.data.data.userType = '企业'
        }else{
          res.data.data.userType=''
        }
        
        this.diaForm = res.data.data
        this.diaForm.remark = res.data.data.remark||''
      }
    })
  },
  computed: {
    // 审核状态图片
    statusImg() {
      if(this.diaForm && this.diaForm.status == 0) return require("@/assets/icon/icon_applying_1.png")
      if(this.diaForm && this.diaForm.status == 1) return require("@/assets/icon/icon_agree.png")
      if(this.diaForm && this.diaForm.status == -1) return require("@/assets/icon/icon_reject.png")
      return ""
    }
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
  // padding: 10px;

  .statusImg {
    width: 100px;
    position: absolute;
    top: 120px;
    right: 30px;
  }

  .image-slot {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    font-size: 12px;
  }


  .detalilBox_all {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 10px;
    word-break: break-all;
    .detalilBox_top {
      background: #fff;
      padding: 10px;
      box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.1600);
    }
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
          // color: #ccc;
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
    text-align: left;
    padding: 0 20px;
    // margin-top: 20px;
    background: #fff;
    padding-bottom: 60px;
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


/deep/ th.el-descriptions-item__cell.el-descriptions-item__label.is-bordered-label {
  width: 150px;
  height: 50px;
  text-align: right;
}
</style>