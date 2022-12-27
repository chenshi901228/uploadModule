<!--财务管理-提现打款-->
<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="withdrawMoney"
        size="small"
        label-width="100px"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item
          v-show="isOpen || formItemCount >= 1"
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
          v-show="isOpen || formItemCount >= 2"
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
          v-show="isOpen || formItemCount >= 3"
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
          v-show="isOpen || formItemCount >= 4"
          label="账户类型"
          prop="type"
        >
          <el-select
            style="width: 200px"
            placeholder="请选择"
            v-model="dataForm.type"
            clearable
          >
            <el-option :value="1" label="个人"></el-option>
            <el-option :value="2" label="企业"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-show="isOpen || formItemCount >= 5"
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
          label="打款时间"
          v-show="isOpen || formItemCount >= 6"
          prop="confirmDate"
        >
          <el-date-picker
            style="width: 200px"
            v-model="dataForm.confirmDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          v-show="isOpen || formItemCount >= 7"
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
        <el-form-item label="打款到账时间" prop="daterange" v-show="isOpen || formItemCount >= 5">
          <el-date-picker placeholder="请选择" v-model="daterange" type="datetimerange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
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
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="exportHandle"
                >{{ $t("export") }}</el-button
              >
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
          min-width="180px"
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
          label="真实名称"
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
          min-width="150px"
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
          prop="depositBankName"
          label="开户银行"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.depositBankName || "--" }}</span>
          </template></el-table-column
        >
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
          </template></el-table-column
        >
        <el-table-column
          prop="bankAccount"
          label="银行账号"
          min-width="180px"
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
            <span>{{ numberConvert(scope.row.amount) }}</span>
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
            <span>{{ numberConvert(scope.row.taxSum) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="addedValueTax"
          label="本次代征增值税"
          header-align="center"
          show-overflow-tooltip
          width="180px"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ numberConvert(scope.row.addedValueTax) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="additionalTax"
          label="本次代征附加税"
          header-align="center"
          show-overflow-tooltip
          width="180px"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ numberConvert(scope.row.additionalTax) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="personalIncomeTax"
          label="本次代征个税"
          header-align="center"
          show-overflow-tooltip
          width="180px"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ numberConvert(scope.row.personalIncomeTax) }}</span>
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
            <span>{{ numberConvert(scope.row.receivedAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accumulatedWithdrawalAmount"
          label="本月累计提现金额"
          header-align="center"
          show-overflow-tooltip
          width="200px"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ numberConvert(scope.row.accumulatedWithdrawalAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="本次开票金额"
          header-align="center"
          show-overflow-tooltip
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ numberConvert(scope.row.amount) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="approveDate"
          label="申请时间"
          min-width="160px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.approveDate || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="withdrawStatus"
          label="提现状态"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.withdrawStatus == "-1"
                  ? "--"
                  : scope.row.withdrawStatus == "1"
                  ? "审核中"
                  : scope.row.withdrawStatus == "2"
                  ? "核算中"
                  : scope.row.withdrawStatus == "3"
                  ? "到帐中"
                  : scope.row.withdrawStatus == "4"
                  ? "已到账"
                  : scope.row.withdrawStatus == "5"
                  ? "未到账"
                  : "--"
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="confirmDate"
          label="打款时间"
          min-width="160px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.confirmDate || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="zsyhReturnDate"
          label="打款到账时间"
          min-width="160px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.withdrawStatus == 4">{{ scope.row.zsyhReturnDate}}</span>
            <span v-else>{{ "--"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                scope.row.withdrawStatus == '2' ||
                scope.row.withdrawStatus == '5'
              "
              type="text"
              size="small"
              icon="el-icon-position"
              @click="confirm(scope.row.id)"
              >确认打款</el-button
            >

            <el-button
              v-if="scope.row.withdrawStatus == '2'||
              scope.row.withdrawStatus == '5'
              "
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="edite(scope.row)"
              >修改税费</el-button
            >
            <el-button
              v-if="scope.row.withdrawStatus == '2'|| scope.row.withdrawStatus == '5' "
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="reject(scope.row)"
              >驳回</el-button
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
    <el-dialog title="确认打款" :visible.sync="dialogVisible" width="30%">
      <el-form
        ref="confirmForm_host"
        :rules="confimFormRule"
        :model="confimForm"
        size="small"
      >
        <el-form-item label="打款时间" prop="confirmDate">
          <el-date-picker
            v-model="confimForm.confirmDate"
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmShowState"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog width="30%" title="修改税费" :visible.sync="dialogFormVisible">
      <el-form ref="form_host" :rules="formRule" :model="form" size="small">
        <el-form-item label="提现金额">
          <span>{{ form.amount || "--" }}</span>
        </el-form-item>
        <el-form-item label="本月累计提现金额">
          <span>{{ form.accumulatedWithdrawalAmount || "--" }}</span>
        </el-form-item>
        <el-form-item label="税费">
          <span>{{ form.taxSum || "--" }}</span>
        </el-form-item>
        <el-form-item label="本次代征增值税" prop="addedValueTax">
          <el-input
            type="number"
            style="width: 200px"
            v-model="form.addedValueTax"
          ></el-input>
        </el-form-item>
        <el-form-item label="本次代征附加税" prop="additionalTax">
          <el-input
            type="number"
            style="width: 200px"
            v-model="form.additionalTax"
          ></el-input>
        </el-form-item>
        <el-form-item label="本次代征个税" prop="personalIncomeTax">
          <el-input
            type="number"
            style="width: 200px"
            v-model="form.personalIncomeTax"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="confirmEdite"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="驳回" :visible.sync="remarkDialogVisible" width="30%">
      <div class="dialog" style="display:flex;">
          <p style="width:50px; margin:0">备注<span style="color:red">*</span></p>
          <el-input
              type="textarea"
              maxlength="100"
              show-word-limit
              :rows="6"
              placeholder="请输入备注"
              v-model="remark">
          </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="remarkDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmShowState"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import debounce from "lodash/debounce"
import mixinViewModule from "@/mixins/view-module";
import Template from "../devtools/template.vue";
import { getUUID, numberConvert } from "@/utils";
export default {
  mixins: [mixinViewModule],
  data() {
    // 验证
    let checkAddedValueTax = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error("本次代征增值税不能为空"));
      } else if (value < 0) {
        callback(new Error("本次代征增值税大于等于0"));
      } else {
        callback();
      }
    };
    let checkAdditionalTax = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error("本次代征附加税不能为空"));
      } else if (value < 0) {
        callback(new Error("本次代征附加税大于等于0"));
      } else {
        callback();
      }
    };
    let checkPersonalIncomeTax = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error("本次代征个税不能为空"));
      } else if (value < 0) {
        callback(new Error("本次代征个税大于等于0"));
      } else {
        callback();
      }
    };
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/finance/anchorWithdraw/pageWithFinance",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/finance/anchorWithdraw/exportWithFinance",
      },
      dataForm: {
        anchorName: "",
        realName: "",
        phone: "",
        type: "", //账户类型
        withdrawStatus: "", //提现状态
        confirmDate: "", //打款时间
        code: "", //提现单号
        startPayDate: "",
        endPayDate: ""
      },
      dataList: [],
      dialogVisible: false,
      uuid: "",
      dialogFormVisible: false,
      form: {
        id: "",
        amount: "",
        accumulatedWithdrawalAmount: "",
        taxSum: "",
        addedValueTax: 0,
        additionalTax: 0,
        personalIncomeTax: "",
      },
      confimForm: {
        id: "",
        confirmDate: "",
      },
      formRule: {
        addedValueTax: [{ validator: checkAddedValueTax, trigger: "blur" }],
        additionalTax: [{ validator: checkAdditionalTax, trigger: "blur" }],
        personalIncomeTax: [
          { validator: checkPersonalIncomeTax, trigger: "blur" },
        ],
      },
      confimFormRule: {
        confirmDate: [
          { required: true, message: "请输入打款时间", trigger: "blur" },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          const date = new Date();
          const oneday = date.getTime();
          return time.getTime() < new Date().getTime() - 86400000;
        },
      },
      daterange:null,

      remark:'',//备注
      remarkDialogVisible:false,//驳回弹窗
    };
  },
  components: { Template },
  
  mounted() {
    this.$bus.$on("change", () => {
      this.getDataList();
    });
  },
  watch: {
    daterange (val) {
      if (val == null) {
        this.dataForm.startPayDate = null
        this.dataForm.endPayDate = null
      } else {
        this.dataForm.startPayDate = val[0]
        this.dataForm.endPayDate = val[1]
      }
    },
    dialogVisible(n, o) {
      if (!n) {
        this.confimForm = {
          id: "",
          confirmDate: "",
        };
      }
    },
    dialogFormVisible(n, o) {
      if (!n) {
        this.form = {
          id: "",
          amount: "",
          accumulatedWithdrawalAmount: "",
          taxSum: "",
          addedValueTax: 0,
          additionalTax: 0,
          personalIncomeTax: "",
        };
      }
    },
  },
  methods: {
    // 添加金额符号
    numberConvert(m) {
      return numberConvert(m)
    },
    //确认修改税费
    confirmEdite: debounce(function() {
      this.$refs.form_host.validate((valid) => {
        if (valid) {
          this.$http["put"]("/sys/finance/anchorWithdraw/updateTax", {
            id: this.form.id,
            addedValueTax: this.form.addedValueTax,
            additionalTax: this.form.additionalTax,
            personalIncomeTax: this.form.personalIncomeTax,
          })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.getDataList();
              this.$message.success("修改成功");
              this.dialogFormVisible = false;
            })
            .catch(() => {});
        }
      });
    }, 1500, { 'leading': true, 'trailing': false }),
    //修改税费
    edite(row) {
      this.form = {
        id: row.id,
        amount: row.amount,
        accumulatedWithdrawalAmount: row.accumulatedWithdrawalAmount,
        taxSum: row.taxSum,
        addedValueTax: row.addedValueTax,
        additionalTax: row.additionalTax,
        personalIncomeTax: row.personalIncomeTax,
      };
      this.dialogFormVisible = true;
    },
    //驳回弹窗
    reject(){
      this.remark=''
      this.remarkDialogVisible=true
    },
    //确认驳回
    confirmShowState(){

    },
    //打款
    confirm(id) {
      this.confimForm.id = id;
      this.uuid = getUUID();
      this.dialogVisible = true;
    },
    //确认打款
    confirmShowState: debounce(function() {
      this.$refs.confirmForm_host.validate((valid) => {
        if (valid) {
          this.$http["put"]("/sys/finance/anchorWithdraw/updateConfirmStatus", {
            id: this.confimForm.id,
            uuid: this.uuid,
            confirmDate: this.confimForm.confirmDate,
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
        }
      });
    }, 1500, { 'leading': true, 'trailing': false }),

    // 重置搜索条件
    resetDataForm() {
      this.dataForm = {
        anchorName: "",
        realName: "",
        phone: "",
        type: "", //账户类型
        withdrawStatus: "", //提现状态
        confirmDate: "", //打款时间
        code: "", //提现单号
        startPayDate:"",
        endPayDate:"",
      };
      this.daterange=null
      this.$refs.withdrawMoney.resetFields();
      this.getDataList();
    },
  },
};
</script>
<style lang="scss" scoped>
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

::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
::v-deep input[type="number"] {
  -moz-appearance: textfield !important;
}
</style>