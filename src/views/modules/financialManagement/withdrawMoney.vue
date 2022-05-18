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
        <el-form-item v-if="isOpen || formItemCount >= 1" label="主播昵称" prop="anchorName">
          <el-input
            style="width: 200px"
            placeholder="主播昵称"
            v-model="dataForm.anchorName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 2" label="真实姓名" prop="realName">
          <el-input
            style="width: 200px"
            placeholder="真实姓名"
            v-model="dataForm.realName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 3" label="手机号码" prop="phone">
          <el-input
            style="width: 200px"
            placeholder="手机号码"
            v-model="dataForm.phone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 4" label="身份证" prop="idCard">
          <el-input
            style="width: 200px"
            placeholder="身份证"
            v-model="dataForm.idCard"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 5" label="提现状态" prop="confirmStatus">
          <el-select
            style="width: 200px"
            placeholder="提现状态"
            v-model="dataForm.confirmStatus"
            clearable
          >
            <el-option :value="1" label="已确认打款"></el-option>
            <el-option :value="0" label="未打款"></el-option>
          </el-select>
        </el-form-item>
        <!-- 搜索重置展开按钮 -->
        <div class="headerTool-search-btns">
          <el-form-item>
            <el-button 
              type="primary" 
              icon="el-icon-search" 
              size="mini"
              @click="getDataList">{{ $t("query") }}</el-button>
            <el-button 
              icon="el-icon-refresh" 
              size="mini" 
              @click="resetDataForm()">{{ $t("reset") }}</el-button>
            <el-button size="mini" plain @click="open">
              <i :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
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
                @click="exportHandle">{{ $t("export") }}</el-button>
            </el-form-item>
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="small" icon="el-icon-refresh" circle @click="getDataList"></el-button>
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
          prop="idCard"
          label="身份证号"
          min-width="150px"
          header-align="center"
          align="center"
          show-overflow-tooltip
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
          show-overflow-tooltip
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
          show-overflow-tooltip
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
          show-overflow-tooltip
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
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createDate || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="confirmStatus"
          label="提现状态"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.confirmStatus === 0
                  ? "待打款"
                  : scope.row.confirmStatus === 1
                  ? "已到账"
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
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-position"
              v-if="scope.row.confirmStatus === 0"
              @click="confirm(scope.row.id)"
              >确认打款</el-button
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
      <span>确认向该主播打款吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmShowState">确 定</el-button>
      </span>
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
        getDataListURL: "/sys/finance/anchorWithdraw/pageWithFinance",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/finance/anchorWithdraw/exportWithFinance",
      },
      dataForm: {
        anchorName: "",
        confirmStatus: "",
        idCard: "",
        phone: "",
        realName: "",
      },
      dataList: [{ createDate: 1 }],
      userId: "",
      dialogVisible: false,
      uuid: "",
      id: "",
    };
  },
  components: { Template },
  mounted() {
    this.$bus.$on("change", () => {
      this.getDataList();
    });
  },
  methods: {
    confirm(id) {
      this.id = id;
      this.uuid = getUUID();
      this.dialogVisible = true;
    },
    confirmShowState() {
      this.$http["put"]("/sys/finance/anchorWithdraw/updateConfirmStatus", {
        id: this.id,
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

    // 重置搜索条件
    resetDataForm() {
      this.dataForm = {
        anchorName: "",
        confirmStatus: "",
        idCard: "",
        phone: "",
        realName: "",
      };
      this.$refs.withdrawMoney.resetFields();
      this.getDataList();
    },
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