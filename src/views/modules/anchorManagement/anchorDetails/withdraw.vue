// 申请提现

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__liveList">
      <el-steps
        :active="active"
        finish-status="success"
        process-status="finish"
        align-center
      >
        <el-step title="提现金额"></el-step>
        <el-step title="开具发票"></el-step>
        <el-step title="提交申请"></el-step>
      </el-steps>

      <div class="all-content">
        <div v-if="active === 0" class="step-one-content">
          <div class="money-title">提现金额</div>
          <div class="money-content">
            <el-form
              :inline="true"
              :model="withdrawForm"
              :rules="dataRule_withdraw"
              ref="withdrawForm_host"
              class="demo-form-inline"
            >
              <el-form-item label="可提现金额：" required>
                <div>{{ anchorDetails.anchorBalance || 0 }}</div>
              </el-form-item>
              <el-form-item label="申请提现金额：" prop="amount" required>
                <div style="display: inline-block">
                  <el-input
                    style="width: 200px"
                    v-model="withdrawForm.amount"
                    placeholder="请输入"
                    size="small"
                    type="number"
                    :min="0"
                    :max="anchorDetails.anchorBalance"
                  >
                  </el-input>
                </div>
                <div>
                  <span style="color: red">（提现金额需大于0元）</span>
                </div>
              </el-form-item>
            </el-form>
          </div>

          <div class="user-title">提现账户</div>
          <div class="user-content">
            <div class="user-item">
              <span class="item"
                >姓 名:{{ anchorDetails.realName || "-" }}</span
              >
              <span
                v-if="
                  anchorDetails.userType == 2 &&
                  $hasPermission('anchor:bank:info')
                "
                class="item"
                >统一社会信用代码:{{
                  anchorDetails.companyCreditCode || "-"
                }}</span
              >
              <span v-else class="item"
                >身份证号:{{ anchorDetails.idCard || "-" }}</span
              >
            </div>
            <div class="user-item">
              <span class="item"
                >账户类型:{{
                  anchorDetails.userType == 2 ? "企业" : "个人"
                }}</span
              >
              <span class="item"
                >开户银行:{{ anchorDetails.depositBank || "-" }}</span
              >
            </div>
            <div class="user-item">
              <span class="item"
                >支行名称:{{ anchorDetails.branchName || "-" }}</span
              >
              <span class="item"
                >账户名称:{{ anchorDetails.accountName || "-" }}</span
              >
            </div>
            <div class="user-item">
              <span class="item"
                >银行账号:{{ anchorDetails.bankAccount || "-" }}</span
              >
              <span class="item"
                >开户行所在地:{{ anchorDetails.address || "-" }}</span
              >
            </div>
          </div>
          <div class="btns">
            <el-button size="small" @click="cancel">取 消</el-button>
            <el-button size="small" type="primary" @click="next"
              >下一步</el-button
            >
          </div>
        </div>

        <div class="step-two-content" v-if="active === 1">
          <div class="money-title">开票金额</div>
          <div class="user-item">
            <span class="item">开票金额:{{ amount || "-" }}</span>
          </div>
          <div class="money-title">开票信息</div>
          <div class="user-item">
            <span class="item">名称:{{ invoiceInfo.name || "--" }}</span>
          </div>
          <div class="user-item">
            <span class="item"
              >纳税人识别号:{{
                invoiceInfo.taxpayer_identification_number || "--"
              }}</span
            >
          </div>
          <div class="user-item">
            <span class="item">地址电话:{{ invoiceInfo.address || "--" }}</span>
          </div>
          <div class="user-item">
            <span class="item"
              >开户行及账号:{{ invoiceInfo.open_account || "--" }}</span
            >
          </div>
          <div class="user-item">
            <span style="color: red" class="item"
              >注：可增值税专用发票或增值税普通发票；</span
            >
          </div>
          <div class="money-title">发票邮寄</div>
          <div class="user-item">
            <span class="item"
              >收件人:{{ invoiceAddress.recipient || "--" }}</span
            >
            <span class="item">电话:{{ invoiceAddress.phone || "--" }}</span>
          </div>
          <div class="user-item">
            <span class="item"
              >邮寄地址:{{ invoiceAddress.mailing_address || "--" }}</span
            >
          </div>
          <div class="user-item">
            <span class="item"
              >邮箱地址:{{ invoiceAddress.email || "--" }}</span
            >
          </div>
          <div class="user-item">
            <span style="color: red" class="item"
              >注：纸质发票需邮寄至以上地址，电子发票发送邮箱即可</span
            >
          </div>
          <div class="btns">
            <el-button size="small" @click="cancelSub">取 消</el-button>
            <el-button size="small" type="primary" @click="sub">提交</el-button>
          </div>
        </div>

        <div class="step-three-content" v-if="active === 3">
          您已申请提现，将在7~14个工作日完成打款~
        </div>
      </div>
    </div>

    <el-dialog
      :title="livePactInfo.title || '申请提现协议'"
      :visible.sync="livePactDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      center
      width="60%"
      :before-close="handleDialogClose"
    >
      <div
        style="height: 50vh; overflow-y: auto"
        v-html="livePactInfo.introduce"
      ></div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          :type="btnDisabled ? 'info' : 'primary'"
          :disabled="btnDisabled"
          @click="confirmLivePact"
          >{{ btnText }}</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { getUUID } from "@/utils";
import Cookies from "js-cookie";
export default {
  components: {},
  data() {
    // 验证提现金额
    let checkWithdraw = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error("提现金额不能为空"));
      } else if (value <= 0) {
        callback(new Error("提现金额需大于0元"));
      } else if (value > this.anchorDetails.anchorBalance) {
        callback(new Error("超过可提现金额"));
      } else {
        callback();
      }
    };

    return {
      withdrawForm: {
        amount: null,
      },
      anchorDetails: {},
      dataRule_withdraw: {
        amount: [{ validator: checkWithdraw, trigger: "blur" }],
      },
      amount: null,
      invoiceLimit: 9, //发票上传图片数量限制
      dialogVisible_Image: false,
      dialogImageUrl: "",
      active: 0,
      livePactDialogVisible: false,
      btnDisabled: true,
      livePactInfo: {}, //直播协议内容
      btnText: "已确认知晓（5s）",
      invoiceInfo: {}, //发票信息
      invoiceAddress: {}, //发票地址信息
    };
  },
  watch: {},
  activated() {
    this.anchorDetails = this.$route.query.anchorDetails;
    console.log();
  },
  computed: {
    uploadUrl() {
      return `${
        window.SITE_CONFIG["apiURL"]
      }/oss/file/upload?access_token=${Cookies.get("access_token")}`;
    },
  },
  created() {},
  methods: {
    //取消提交
    cancelSub() {
      this.$confirm("确认取消本次的提现申请？", "取消", {
        confirmButtonText: "确认",
        showCancelButton: true,
        showClose: false,
      })
        .then(() => {
          this.closeCurrentTab();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
          reject();
        });
    },
    //提交
    sub() {
      this.$confirm("确认提交提现申请？", "提交", {
        confirmButtonText: "确认",
        showCancelButton: true,
        showClose: false,
      })
        .then(() => {
          this.$http
            .post("/sys/anchorWithdraw", {
              amount: parseInt(this.amount),
              uuid: getUUID(),
            })
            .then(({ data: res }) => {
              if (res.code == 0) {
                this.$message.success("申请提现成功");
                this.active = 3;
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
          reject();
        });
    },
    //点击x关闭
    handleDialogClose() {
      this.btnDisabled = true;
      this.livePactDialogVisible = false;
    },
    //取消操作
    cancel() {
      this.$confirm("确认取消本次的提现申请？", "取消", {
        confirmButtonText: "确认",
        showCancelButton: true,
        showClose: false,
      })
        .then(() => {
          this.closeCurrentTab();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
          reject();
        });
    },
    //下一步
    next() {
      this.$refs.withdrawForm_host.validate((valid) => {
        if (valid) {
          // 企业银行账号核验中不可申请提现
          if (
            this.anchorDetails.haveApplyInfo &&
            this.anchorDetails.userType == 2
          ) {
            return this.$confirm(
              "您的银行账号正在核验中，不可申请提现",
              "提示",
              {
                confirmButtonText: "确认",
                showCancelButton: false,
                showClose: false,
              }
            ).catch(() => {});
          }

          this.btnDisabled = true;
          this.init();
        }
      });
    },
    // 协议确认倒计时
    doLoop: function (seconds) {
      seconds = seconds ? seconds : 5;
      this.btnText = `已确认知晓（${seconds}s）`;
      let countdown = setInterval(() => {
        if (seconds > 0) {
          this.btnText = `已确认知晓（${seconds}s）`;
          --seconds;
        } else {
          this.btnText = this.livePactDialogVisible
            ? "已确认知晓"
            : "已确认知晓，去直播";
          this.btnDisabled = false;
          clearInterval(countdown);
        }
      }, 1000);
    },
    //处理数据
    getInvoiceInfo(data) {
      //数据字典返回数据生成对象
      let arr = {};
      data.map((item) => {
        arr[item.dictValue] = item.dictLabel;
      });
      return arr;
    },
    //获取开票信息
    getPaper() {
      this.$http
        .get(
          "/sys/dict/data/pageWithName?page=1&limit=20&dictTypeId=1548963270769565698"
        )
        .then(({ data: res }) => {
          if (res.code != 0) return this.$message.error(res.msg);
          const data = res.data;
          if (!data) return this.$message.error("无开票信息");
          this.invoiceAddress = this.getInvoiceInfo(data);
        })
        .catch((err) => {});
    },
    //获取地址
    getAddress() {
      this.$http
        .get(
          "/sys/dict/data/pageWithName?page=1&limit=20&dictTypeId=1548961326764187650"
        )
        .then(({ data: res }) => {
          if (res.code != 0) return this.$message.error(res.msg);
          const data = res.data;
          if (!data) return this.$message.error("无开票信息");
          this.invoiceInfo = this.getInvoiceInfo(data);
        })
        .catch((err) => {});
    },
    //确认知晓
    confirmLivePact() {
      this.getPaper();
      this.getAddress();
      this.amount = this.withdrawForm.amount;
      this.livePactDialogVisible = false;
      if (this.active++ > 2) this.active = 0;
    },
    //显示协议
    init() {
      this.$http
        .get(
          "/sys/sysConsultativeManagement/getKey/apply_for_withdrawal_agreement"
        )
        .then(({ data: res }) => {
          this.livePactDialogVisible = true; //未开播进入直播间阅读协议
          this.doLoop(5);
          if (res.code != 0) return this.$message.error(res.msg);
          this.livePactInfo = res.data;
        })
        .catch((err) => {
          this.livePactDialogVisible = true; //未开播进入直播间阅读协议
          this.doLoop(5);
          this.$message.error(JSON.stringify(err.message));
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.mod-live__liveList {
  /deep/.frontCoverImg {
    width: 100%;
    height: 80px;
  }
  /deep/.el-autocomplete {
    width: 100% !important;
  }
  .withdraw_bank_info {
    .header {
      width: 120px;
      text-align: right;
      padding-right: 12px;
    }
    & > div {
      margin-top: 10px;
    }
    & > div:not(:first-child) {
      text-indent: 120px;
    }
  }
  /deep/.uploadStyle {
    .el-upload--picture-card {
      width: 90px;
      height: 90px;
    }
    .el-upload-list--picture-card > li {
      width: 90px;
      height: 90px;
    }
    .el-progress {
      width: 90px;
      height: 90px;
    }
    .el-progress-circle {
      width: 100% !important;
      height: 100% !important;
    }
    .uploadStyle-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
      span {
        line-height: normal;
        display: inline-block;
        margin-top: 10px;
      }
    }
  }
  .previewInvoiceList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    img {
      width: 30%;
      height: 100px;
      object-fit: contain;
      margin-top: 10px;
      cursor: pointer;
      &:not(:nth-child(3n)) {
        margin-right: 5%;
      }
      &:hover {
        border: 1px solid #999;
      }
    }
  }

  /deep/.change-dialog {
    .el-dialog {
      width: 30%;
    }
  }

  .all-content {
    display: flex;
    justify-content: center;
    align-items: center;
    .step-one-content {
      width: 70%;
      padding-top: 50px;
      .money-title {
        border-left: 5px solid #409eff;
        padding-left: 5px;
      }
      .money-content {
        /deep/.el-form {
          display: flex;
          justify-content: space-between;
          padding-left: 50px;
          .el-form-item {
            flex: 1;
          }
        }
      }
      .user-title {
        border-left: 5px solid #409eff;
        padding-left: 5px;
        margin-bottom: 20px;
      }
      .user-content {
        padding-left: 50px;
        .user-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          .item {
            flex: 1;
          }
        }
      }
      .btns {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
    .step-two-content {
      width: 70%;
      padding-top: 50px;
      .money-title {
        border-left: 5px solid #409eff;
        padding-left: 5px;
      }
      .user-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-left: 80px;
        .item {
          flex: 1;
        }
      }
      .btns {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
    .step-three-content {
      width: 70%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 34px;
      font-weight: 500;
      padding-top: 200px;
    }
  }
}

::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}
</style>