<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="withdrawalApproval"
        size="small"
        label-width="100px"
        @keyup.enter.native="getDataList"
      >
        <el-form-item
          v-if="isOpen || formItemCount >= 1"
          label="主播昵称"
          prop="anchorName"
        >
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.anchorName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 2"
          label="真实姓名"
          prop="realName"
        >
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.realName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 3"
          label="手机号码"
          prop="phone"
        >
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.phone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 4"
          label="账户类型"
          prop="type"
        >
          <el-select
            style="width: 200px"
            placeholder="请选择"
            v-model="dataForm.type"
            clearable
          >
            <el-option :value="2" label="企业"></el-option>
            <el-option :value="1" label="个人"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 5"
          label="提现状态"
          prop="withdrawStatus"
        >
          <el-select
            style="width: 200px"
            placeholder="请选择"
            v-model="dataForm.withdrawStatus"
            clearable
          >
            <el-option :value="1" label="审核中"></el-option>
            <el-option :value="2" label="核算中"></el-option>
            <el-option :value="3" label="到帐中"></el-option>
            <el-option :value="4" label="已到账"></el-option>
            <el-option :value="5" label="未到账"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 6"
          label="提现单号"
          prop="code"
        >
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.code"
            clearable
          ></el-input>
        </el-form-item>
        <!-- 搜索重置展开按钮 -->
        <div class="headerTool-search-btns">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getDataList"
              >{{ $t("query") }}</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetDataForm()"
              >{{ $t("reset") }}</el-button
            >
            <el-button size="mini" plain @click="open">
              <i
                :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button>
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <!-- <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="exportHandle"
                >{{ $t("export") }}</el-button
              > -->
            </el-form-item>
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip
                class="item"
                effect="dark"
                content="刷新"
                placement="top"
              >
                <el-button
                  size="small"
                  icon="el-icon-refresh"
                  circle
                  @click="query"
                ></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        @selection-change="dataListSelectionChangeHandle"
        :height="siteContentViewHeight"
        style="width: 100%"
        ref="table"
      >
        <el-table-column
          prop="id"
          label="提现单号"
          header-align="center"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.id || "--" }}</span>
          </template></el-table-column
        >
        <el-table-column
          prop="anchorName"
          label="主播昵称"
          header-align="center"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.anchorName || "--" }}</span>
          </template></el-table-column
        >
        <el-table-column
          prop="realName"
          label="真实姓名"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.realName || "--" }}</span>
          </template></el-table-column
        >
        <el-table-column
          prop="phone"
          label="手机号码"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.phone || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userType"
          label="账户类型"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.userType === 1
                ? "个人"
                : scope.row.userType === 2
                ? "企业"
                : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="depositBank"
          label="开户银行"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.depositBank || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountName"
          label="账户名称"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.accountName || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bankAccount"
          label="银行账号"
          min-width="150px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.bankAccount || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="branchName"
          label="支行名称"
          min-width="140px"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.branchName || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="开户行所在地"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.address || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="提现金额"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <span>￥{{scope.row.amount? scope.row.amount: "--" }}</span> 
          </template>
        </el-table-column>
        <el-table-column
          prop="taxSum"
          label="税费"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            
            <span>￥{{scope.row.taxSum? parseFloat(scope.row.taxSum).toLocaleString()  :"--" }}</span> 

          </template>
        </el-table-column>
        <el-table-column
          prop="addedValueTax"
          label="本次代征增值税"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <span>￥{{scope.row.addedValueTax? parseFloat(scope.row.addedValueTax).toLocaleString()  : "--" }}</span> 

          </template>
        </el-table-column>

        <el-table-column
          prop="additionalTax"
          label="本次代征附加税"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <span>￥{{scope.row.additionalTax? parseFloat(scope.row.additionalTax).toLocaleString()   : "--" }}</span> 

          </template>
        </el-table-column>
        <el-table-column
          prop="personalIncomeTax"
          label="本次代征个税"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <span>￥{{scope.row.personalIncomeTax?  parseFloat(scope.row.personalIncomeTax).toLocaleString()   : "--" }}</span> 

          </template>
        </el-table-column>
        <el-table-column
          prop="receivedAmount"
          label="到账金额"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <span>￥{{scope.row.receivedAmount? scope.row.receivedAmount: "--" }}</span> 

          </template>
        </el-table-column>
        <el-table-column
          prop="accumulatedWithdrawalAmount"
          label="本月累计提现金额"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <span>￥{{scope.row.accumulatedWithdrawalAmount? scope.row.accumulatedWithdrawalAmount:"--" }}</span> 

          </template>
        </el-table-column>
        <el-table-column
          prop="approveStatus"
          label="提现状态"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.approveStatus === 0
                ? "审核中"
                : scope.row.approveStatus === 1 && scope.row.confirmStatus === 0
                ? "核算中"
                : scope.row.confirmStatus === 1 && scope.row.payStatus === 0
                ? "到帐中"
                : scope.row.confirmStatus === 1 && scope.row.payStatus === 1
                ? "已到账"
                : scope.row.confirmStatus === 1 && scope.row.payStatus === -1
                ? "未到账"
                : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="申请时间"
          header-align="center"
          show-overflow-tooltip
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createDate || "--" }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <!-- <el-button
              type="text"
              size="small"
              v-if="scope.row.handlingStatus === 2"
              >通过</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="scope.row.handlingStatus === 2"
              >驳回</el-button
            > -->
            <!-- <el-button
              type="text"
              size="small"
              v-if="scope.row.approveStatus === 0"
              @click="showDialog(scope.row.id)"
              >审批</el-button
            > -->
            <el-button
              type="text"
              size="small"
              v-if="scope.row.approveStatus === 0"
              @click="showDialog(scope.row.id)"
              >确认</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle"
      >
      </el-pagination>
    </div>
    <el-dialog title="审批" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="small"
      >
        <el-form-item label="备注" prop="desc">
          <el-input
            placeholder="请输入,可不填"
            type="textarea"
            v-model="ruleForm.desc"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="updateApproveStatus(-1)"
          >驳 回</el-button
        >
        <el-button size="small" type="primary" @click="updateApproveStatus(1)"
          >通 过</el-button
        >
      </div>
    </el-dialog>


    <el-dialog title="确认" :visible.sync="dialogVisible">
      <span>确认通过该提现申请</span>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="confirm"
          >通 过</el-button
        >
      </div>
    </el-dialog>
    
  </el-card>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import { addDynamicRoute } from "@/router";
import Template from "../devtools/template.vue";
import { getUUID } from "@/utils";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/finance/anchorWithdraw/pageWithOperation",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/finance/anchorWithdraw/exportWithOperation",
      },
      dataForm: {
        anchorName: "",
        phone: "",
        realName: "",
        type: null,
        withdrawStatus: null,
        code: "",
      },
      dataList: [],
      userId: "",
      dialogFormVisible: false,
      ruleForm: {
        desc: "",
      },
      uuid: "",
      id: "",
      dialogVisible:false
    };
  },
  components: { Template },
  mounted() {
    this.$bus.$on("change", () => {
      this.getDataList();
    });
  },
  methods: {
    showDialog(id) {
      this.uuid = getUUID();
      this.id = id;
      // this.dialogFormVisible = true;
      this.dialogVisible = true;

    },
    // 重置搜索条件
    resetDataForm() {
      this.dataForm = {
        anchorName: "",
        approveStatus: "",
        idCard: "",
        phone: "",
        realName: "",
      };
      this.$refs.withdrawalApproval.resetFields();
      this.getDataList();
    },
    // 审核
    updateApproveStatus(status) {
      this.$confirm(
        `是否执行 [${status == -1 ? "拒绝" : "同意"}[ 操作`,
        this.$t("prompt.title"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(() => {
          this.$http["put"]("/sys/finance/anchorWithdraw/updateApproveStatus", {
            id: this.id,
            approveStatus: status,
            uuid: this.uuid,
          })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.getDataList();
              this.$message.success("操作成功");
              this.dialogFormVisible = false;
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    //确认
    confirm() {
      this.$http["put"]("/sys/finance/anchorWithdraw/updateApproveStatus", {
            id: this.id,
            approveStatus: 1,
            uuid: this.uuid,
          })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.getDataList();
              this.$message.success("操作成功");
              this.dialogVisible = false;
            })
            .catch(() => {});
    },
        // 当金额大于10000时，在作展示的时候，需要加千分位逗号，就是每隔1000要用逗号分隔；
    format (n) {
      let num = n.toString()
      let decimals = ''
      // 判断是否有小数
      num.indexOf('.') > -1 ? decimals = num.split('.')[1] : decimals
      let len = num.length
      if (len <= 3) {
        return num
      } else {
        let temp = ''
        let remainder = len % 3
        decimals ? temp = '.' + decimals : temp
        if (remainder > 0) { // 不是3的整数倍
          return num.slice(0, remainder) + ',' + num.slice(remainder, len).match(/\d{3}/g).join(',') + temp
        } else { // 是3的整数倍
          return num.slice(0, len).match(/\d{3}/g).join(',') + temp
        }
      }
    }
  },
};
</script>
<style lang="scss"  scoped>
.forbiddenAllBtn {
  width: 120px;
  height: 35px;
  background: #409eff;
  border-radius: 5px;
  color: #fff;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  margin: 10px 0;
}

/deep/.el-dialog {
  display: flex;
  display: -ms-flex; /* 兼容IE */
  flex-direction: column;
  -ms-flex-direction: column; /* 兼容IE */
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
/deep/.el-dialog .el-dialog__body {
  padding: 20px; /*这个不重要*/
  max-height: 75vh;
  flex: 1;
  -ms-flex: 1 1 auto; /* 兼容IE */
  overflow-y: auto;
  overflow-x: hidden;
}

/deep/.el-dialog__wrapper {
  overflow: hidden; /*隐藏ie和edge中遮罩的滚动条*/
}
</style>