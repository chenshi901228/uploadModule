<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="withdrawalApproval"
        label-width="80px"
        @keyup.enter.native="getDataList()"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="主播昵称" prop="anchorName">
              <el-input
                size="small"
                v-model="dataForm.anchorName"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="真实姓名" prop="realName">
              <el-input
                size="small"
                v-model="dataForm.realName"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="phone">
              <el-input
                size="small"
                v-model="dataForm.phone"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <div v-if="isOpen">
            <el-row>
              <el-col :span="8">
                <el-form-item label="身份证" prop="idCard">
                  <el-input
                    size="small"
                    v-model="dataForm.idCard"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审批状态" prop="approveStatus">
                  <el-select
                    size="small"
                    v-model="dataForm.approveStatus"
                    clearable
                  >
                    <el-option :value="0" label="申请中"></el-option>
                    <el-option :value="1" label="已同意"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-col :span="24">
            <el-form-item style="float: right; padding-right: 10px">
              <el-button type="info" size="small" @click="exportHandle()">{{
                $t("export")
              }}</el-button>
              <el-button size="small" type="primary" @click="getDataList()">{{
                $t("query")
              }}</el-button>
              <el-button size="small" @click="resetDataForm()">{{
                $t("reset")
              }}</el-button>
              <el-button size="small" type="primary" @click="open">
                {{ isOpen ? "收起" : "展开"
                }}<i
                  style="margin-left: 10px"
                  :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                ></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        :height="siteContentViewHeight"
        style="width: 100%"
        ref="table"
      >
        <el-table-column
          prop="anchorName"
          label="主播昵称"
          header-align="center"
          align="center"
          min-width="120px"
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
        >
          <template slot-scope="scope">
            <span>{{ scope.row.phone || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="idCard"
          label="身份证号"
          min-width="150px"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.idCard || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountName"
          label="账户名称"
          min-width="120px"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.accountName || "--" }}</span>
          </template></el-table-column
        >
        <el-table-column
          prop="bankAccount"
          label="银行账号"
          min-width="150px"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.bankAccount || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="depositBank"
          label="开户银行"
          min-width="100px"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.depositBank || "--" }}</span>
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
            <span>{{ scope.row.amount || "--" }}</span>
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
            <span>{{ scope.row.receivedAmount || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="申请时间"
          min-width="160px"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createDate || "--" }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="approveDate"
          label="审批时间"
          min-width="160px"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.approveDate || "--" }}</span>
          </template></el-table-column
        >
        <el-table-column
          prop="approveStatus"
          label="审批状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.approveStatus === 0
                  ? "申请中"
                  : scope.row.approveStatus === 1
                  ? "已同意"
                  : "--"
              }}
            </div>
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
            <el-button
              type="text"
              size="small"
              v-if="scope.row.approveStatus === 0"
              @click="showDialog(scope.row.id)"
              >审批</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
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
        <el-button @click="updateApproveStatus(-1)">驳 回</el-button>
        <el-button type="primary" @click="updateApproveStatus(1)"
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
        approveStatus: "",
        idCard: "",
        phone: "",
        realName: "",
      },
      dataList: [],
      userId: "",
      otherViewHeight: 0, //搜索栏高度
      isOpen: false, //搜索栏展开/收起
      dialogFormVisible: false,
      ruleForm: {
        desc: "",
      },
      uuid: "",
      id: "",
    };
  },
  components: { Template },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.documentClientHeight;
      },
    },
    siteContentViewHeight() {
      var height =
        this.documentClientHeight -
        this.otherViewHeight -
        (50 + 40 + 30 + 40 + 47);
      return height;
    },
  },
  watch: {
    isOpen() {
      this.setOtherViewHeight();
    },
  },
  activated() {
    this.setOtherViewHeight();
    this.$nextTick(() => {
      this.$refs.table.doLayout();
    });
  },
  mounted() {
    this.$bus.$on("change", () => {
      this.getDataList();
    });
  },
  methods: {
    // 搜索栏高度设置
    setOtherViewHeight() {
      setTimeout(() => {
        if (document.querySelector(".headerTool")) {
          let h = document
            .querySelector(".headerTool")
            .getBoundingClientRect().height;
          this.otherViewHeight = Math.ceil(h);
        }
      }, 150);
    },
    // 搜索栏收起/展开
    open() {
      this.isOpen = !this.isOpen;
      this.resetDataForm();
    },
    showDialog(id) {
      this.uuid = getUUID();
      this.id = id;
      this.dialogFormVisible = true;
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
  },
};
</script>
<style  scoped>
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
</style>