// 申请提现

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__liveList">
     

      <div class="all-content">
        <!-- 第一步 -->
        <div v-if="active === 0" class="step-one-content">
          <div style="height: 50px;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 25px;border-bottom:1px solid #EBEEF5;">
            提现金额
          </div>
          <div class="money-content">
            <el-form
              :model="withdrawForm"
              :rules="dataRule_withdraw"
              ref="withdrawForm_host"
              label-width="140px"
              size="small"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="可提现金额" required>
                    <el-input
                        v-model="anchorDetails.anchorBalance"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="提现金额" prop="amount">
                    <el-input-number
                      v-model="withdrawForm.amount"
                      :controls='false'
                      placeholder="请输入"
                      :precision="2"
                      :step="0.1"
                      :min="1"
                      :max="anchorDetails.anchorBalance"
                    >
                    </el-input-number>
                    <div>
                      <span style="color: red">（提现金额需大于1元）</span>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <div style="height: 50px;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 25px;border-bottom:1px solid #EBEEF5;">
            提现账户
          </div>
          <div class="user-content">
              <el-form
                size="small"
                label-width="140px"
              >
              <el-row>
                <el-col :span="12">
                    <el-form-item label="账户类型">
                        <el-select @change="handleChangeUserType" v-model="accountType" placeholder="请选择" size="mini" style="width:80px">
                            <el-option label="企业" :value="2" />
                            <el-option label="个人" :value="1" />
                        </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名" v-if="accountType == 1">
                    <el-input
                      v-model="anchorDetails.realName"
                      placeholder="请输入"
                      disabled
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="公司名称" v-if="accountType == 2">
                    <el-input
                      v-model="enterpriseBankInfo.companyName"
                      placeholder="请输入"
                      disabled
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col v-if="accountType == 2 && $hasPermission('anchor:bank:info')" :span="12">
                  <el-form-item label="统一社会信用代码"  >
                    <el-input
                        v-model="enterpriseBankInfo.companyCreditCode"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                    
                  </el-form-item>
                </el-col>
                <el-col v-else :span="12">
                  <el-form-item label="身份证号" >
                    <el-input
                        v-model="anchorDetails.idCard"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                    
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="账户类型" >
                    <el-input
                        :value='accountType == 2 ? "企业" : "个人"'
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                    
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="accountType == 1">
                  <el-form-item label="开户银行" >
                    <el-input
                        v-model="personalBankInfo.depositBank"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                    
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="accountType == 2">
                  <el-form-item label="开户银行" >
                    <el-input
                        v-model="enterpriseBankInfo.depositBank"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                    
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="accountType == 1">
                  <el-form-item label="支行名称" >
                    <el-input
                        v-model="personalBankInfo.branchName"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                    
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="accountType == 2">
                  <el-form-item label="支行名称" >
                    <el-input
                        v-model="enterpriseBankInfo.branchName"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                    
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="accountType == 1">
                  <el-form-item label="账户名称" >
                    <el-input
                        v-model="personalBankInfo.accountName"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="accountType == 2">
                  <el-form-item label="账户名称" >
                    <el-input
                        v-model="enterpriseBankInfo.accountName"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="accountType == 1">
                  <el-form-item label="银行账号" >
                    <el-input
                        v-model="personalBankInfo.bankAccount"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="accountType == 2">
                  <el-form-item label="银行账号" >
                    <el-input
                        v-model="enterpriseBankInfo.bankAccount"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="accountType == 1">
                  <el-form-item label="开户行所在地" >
                    <el-input
                        v-model="personalBankInfo.address"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
        
         
          </div>
          <div class="btns">
            <el-button size="small" type="primary" :disabled="nextBtnLoading" @click="next" :loading="nextBtnLoading"
              >下一步</el-button
            >
            <el-button size="small" @click="cancel">取 消</el-button>

          </div>
        </div>
        <!-- 第二步 -->
        <div class="step-two-content" v-if="active === 1">
          <div class="money-title">开票金额</div>
              <el-form
                label-width="140px"
              >
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="开票金额" >
                      <el-input-number
                          v-model="amount"
                          placeholder="请输入"
                          :controls='false'
                          :precision="2"
                          :step="0.1"
                          disabled
                        >
                        </el-input-number>
                      
                    </el-form-item>
                  </el-col>
                </el-row>
            </el-form>
      
          <div class="money-title">开票信息</div>
            <el-form
              label-width="140px"
              size="small"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="名称">
                    <el-input
                        v-model="invoiceInfo.name"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                    
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="纳税人识别号">
                    <el-input
                      v-model="invoiceInfo.taxpayer_identification_number"
                      placeholder="请输入"
                      disabled
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="地址电话" >
                    <el-input
                        v-model="invoiceInfo.address"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="开户行及账号" >
                    <el-input
                        :value='invoiceInfo.open_account'
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          <div class="user-item">
            <span style="color: red" class="item"
              >注：可增值税专用发票或增值税普通发票；</span
            >
          </div>
          <div class="money-title">发票邮寄</div>
            <el-form
              label-width="140px"
              size="small"
              >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="收件人" >
                    <el-input
                        v-model="invoiceAddress.recipient"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电话" >
                    <el-input
                        v-model="invoiceAddress.phone"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮寄地址"  >
                    <el-input
                        v-model="invoiceAddress.mailing_address"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮箱地址" >
                    <el-input
                        v-model="invoiceAddress.email"
                        placeholder="请输入"
                        disabled
                      >
                      </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          <div class="user-item">
            <span style="color: red" class="item"
              >注：纸质发票需邮寄至以上地址，电子发票发送邮箱即可</span
            >
          </div>
          <div class="btns">
            <el-button size="small" @click="toPreStep">上一步</el-button>
            <el-button size="small" type="primary" @click="sub" :disabled="submitLoading" :loading="submitLoading">提交</el-button>
          </div>
        </div>
        <!-- 第三步 -->
        <div class="step-three-content" v-if="active === 3">
          您已申请提现，将在7~14个工作日完成打款~
        </div>
      </div>
    </div>

    <!-- 协议弹框 -->
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
import ComModule from "@/mixins/common-module"
import { getUUID } from "@/utils";
import Cookies from "js-cookie";
export default {
  mixins: [ComModule],
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
      userId: "",
      withdrawForm: {
        amount: null,
      },
      anchorDetails: {},
      dataRule_withdraw: {
        amount: [{ required: true, validator: checkWithdraw, trigger: "blur" }],
      },
      amount: null,
      invoiceLimit: 9, //发票上传图片数量限制
      dialogVisible_Image: false,
      dialogImageUrl: "",
      active: 0, //申请步骤
      livePactDialogVisible: false,
      btnDisabled: true,
      livePactInfo: {}, //直播协议内容
      btnText: "已确认知晓（5s）",
      invoiceInfo: {}, //发票信息
      invoiceAddress: {}, //发票地址信息
      nextBtnLoading: false, //下一步请求协议
      submitLoading: false, //提交申请loading
      accountType: 2,
      personalBankInfo:{} ,//个人提现银行卡信息
      enterpriseBankInfo:{} ,//企业提现银行卡信息
    };
  },
  activated() {
    this.userId = this.$store.state.user.id;
    this.getAnchorInfo()
    this.getAccountAmount()
    this.handleGetBankInfo()
  },
  methods: {
    // 获取用户详细信息
    getAnchorInfo() {
      this.$http.get(`/sys/anchor/info/getInfoWithAnchor`, { params: { anchorId: this.userId } }).then(({ data: res }) => {
        if (res.code !== 0) return this.$message.error(res.msg);

        this.anchorDetails = { ...this.anchorDetails, ...res.data };
      }).catch((err) => this.$message.error(JSON.stringify(err.message)));
    },

    //切换账户类型
    handleChangeUserType(value) {
        if ( value === 2 ) {
            if ( Object.keys(this.enterpriseBankInfo).length === 0 ) {
                this.accountType = 1
                this.$message.warning('您还未认证企业身份')
            } else if ( this.enterpriseBankInfo.haveApply ) {
                this.accountType = 1
                this.$message.warning('您的企业身份认证正在审核中，暂不可提现')
            }
        } else if ( value === 1 ) {
            if ( Object.keys(this.personalBankInfo).length === 0 ) {
                this.accountType = 2
                this.$message.warning('您还未认证个人身份')
            } else if ( this.personalBankInfo.haveApply ) {
                this.accountType = 2
                this.$message.warning('您的个人身份认证正在审核中，暂不可提现')
            }
        }
    },

    //获取银行卡相关信息
    handleGetBankInfo() {
        this.$http.post('sys/anchorWithdraw/checkWithdraw').then(({ data:res }) => {
            if ( res && +res.code === 0 ) {
                const { bankInfo } = res.data
                this.personalBankInfo = bankInfo.filter(item => +item.userType === 1)[0] || {}
                this.enterpriseBankInfo = bankInfo.filter(item => +item.userType === 2)[0] || {}
                //未认证企业 || 企业在审核中 默认展示个人信息
                if ( Object.keys(this.enterpriseBankInfo).length === 0 || this.enterpriseBankInfo.haveApply ) this.accountType = 1 
            } else if ( res && res.code == -3 ) {//今日已提现
                this.closeCurrentTab()
                this.$message.warning(res.msg)
            } else {
                this.$message.warning(res.msg)
            }
        })
    },

    // 获取用户账户金额信息
    getAccountAmount() {
      this.$http
        .get(`/sys/manage/userDetail/getWithAnchor`, { params: { anchorId: this.userId } })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return vm.$message.error(res.msg);
          }
          this.anchorDetails = {
            ...this.anchorDetails,
            priceIncome: res.data.priceIncome,
            anchorWithdraw: res.data.anchorWithdraw,
            anchorBalance: res.data.anchorBalance,
          };
        })
        .catch(() => { });
    },
    //返回上一步
    toPreStep() {
      this.$confirm("确认返回上一步？", "取消", {
        confirmButtonText: "确认",
        showCancelButton: true,
        showClose: false,
      })
        .then(() => {
          this.active = 0
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    //提交申请
    sub() {
      this.$confirm("确认提交提现申请？", "提交", {
        confirmButtonText: "确认",
        showCancelButton: true,
        showClose: false,
      })
        .then(() => {
          this.submitLoading = true
          this.$http
            .post("/sys/anchorWithdraw", {
              amount: this.amount,
              uuid: getUUID(),
              userType:this.accountType
            })
            .then(({ data: res }) => {
              this.submitLoading = false
              if (res.code == 0) {
                this.$message.success("申请提现成功");
                this.active = 3;
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.submitLoading = false
              this.$message.error(JSON.stringify(err && err.message));
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    //点击x关闭协议
    handleDialogClose() {
      if(this.countdown) {
        clearInterval(this.countdown);
        this.countdown = null
      }
      this.btnDisabled = true;
      this.livePactDialogVisible = false;
    },
    //取消提现申请
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
        });
    },
    //下一步
    next() {
      this.$refs.withdrawForm_host.validate((valid) => {
        if (valid) {
          // 企业银行账号核验中不可申请提现
        //   if ( this.anchorDetails.haveApplyInfo ) {
        //     return this.$confirm(
        //       "您的银行账号正在核验中，不可申请提现",
        //       "提示",
        //       {
        //         confirmButtonText: "确认",
        //         showCancelButton: false,
        //         showClose: false,
        //       }
        //     ).catch(() => {});
        //   }

          this.btnDisabled = true;
          this.init();
        }
      });
    },
    // 协议确认倒计时
    doLoop(seconds) {
      if(this.countdown) {
        clearInterval(this.countdown);
        this.countdown = null
      }
      seconds = seconds ? seconds : 5;
      this.btnText = `已确认知晓（${seconds}s）`;
      this.countdown = setInterval(() => {
        seconds--;
        if (seconds > 0) {
          this.btnText = `已确认知晓（${seconds}s）`;
        } else {
          this.btnText = "已确认知晓";
          this.btnDisabled = false;
          clearInterval(this.countdown);
          this.countdown = null
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
      this.nextBtnLoading = true
      this.$http.get(
          "/sys/sysConsultativeManagement/getKey/apply_for_withdrawal_agreement"
        )
        .then(({ data: res }) => {
          this.nextBtnLoading = false
          this.livePactDialogVisible = true; 
          this.doLoop(5);
          if (res.code != 0) return this.$message.error(res.msg);
          this.livePactInfo = res.data;
        })
        .catch((err) => {
          this.nextBtnLoading = false
          this.livePactDialogVisible = true; 
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
    .el-row {
      width: 100%;
    }

    .step-one-content {
      width:100%;
      .money-title {
     height: 50px;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 25px;border-bottom:1px solid #EBEEF5;
      }
      .money-content {
        
      }
      .user-title {
     height: 50px;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 25px;border-bottom:1px solid #EBEEF5;
      }
      .user-content {
          /deep/.el-form {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .el-form-item {
            flex: 1;
          }
        }
      }
      .btns {
        margin-top: 20px;

        display: flex;
        align-items: center;
        button{
          width: 75px;
        }
      }
    }
    .step-two-content {
      
      .money-title {
     height: 50px;line-height: 50px;font-size: 20px;font-family: Microsoft YaHei-Bold, Microsoft YaHei;font-weight: bold;color: #000000;margin-bottom: 25px;border-bottom:1px solid #EBEEF5;
      }
      .user-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 70px;
        .item {
          flex: 1;
        }
      }
      .btns {
        margin-top: 20px;
        display: flex;
        align-items: center;
         button{
          width: 75px;
        }
      }
    }
    .step-three-content {
      width: 100%;
      font-size: 34px;
      font-weight: 500;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      padding: 0 100px;
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
/deep/ .el-card__body {
    padding: 0 20px 20px;
}
/deep/ .el-form-item {
    margin-bottom:0;
}
       /deep/.el-form {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          .el-form-item {
            flex: 1;
          }
        }
        /deep/.el-col {
          margin-bottom: 10px;
        }
</style>