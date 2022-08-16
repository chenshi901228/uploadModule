<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="salesRecord"
        label-width="100px"
        size="small"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item v-if="isOpen || formItemCount >= 1" label="用户昵称" prop="userName">
          <el-input
            style="width: 200px"
            placeholder="用户昵称"
            v-model="dataForm.userName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 2" label="手机号码" prop="userPhone">
          <el-input
            style="width: 200px"
            placeholder="手机号码"
            v-model="dataForm.userPhone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 3" label="商品名称" prop="productName">
          <el-input
            style="width: 200px"
            placeholder="商品名称"
            v-model="dataForm.productName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 4" label="商品类型" prop="productType">
          <el-select
            style="width: 200px"
            placeholder="商品类型"
            v-model="dataForm.productType"
            clearable
          >
            <el-option value="专业课" label="专业课"></el-option>
            <el-option value="服务课" label="服务课"></el-option>
            <el-option value="线下课" label="线下课"></el-option>
            <el-option value="权益卡" label="权益卡"></el-option>
            <el-option value="书籍" label="书籍"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 5" label="退款方式" prop="payType">
          <el-select style="width: 200px" placeholder="退款方式" v-model="dataForm.payType" clearable>
            <el-option value="微信" label="微信"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 6" label="关联订单编号" prop="weixinUserProductId">
          <el-input
            style="width: 200px"
            placeholder="关联订单编号"
            v-model="dataForm.weixinUserProductId"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 7" label="退款单号" prop="id">
          <el-input
            style="width: 200px"
            placeholder="退款单号"
            v-model="dataForm.id"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-if="isOpen || formItemCount >= 8" label="审批节点状态" prop="confirmStatus">
          <el-select
            style="width: 200px"
            placeholder="审批节点状态"
            v-model="dataForm.confirmStatus"
            clearable
          >
            <el-option :value="0" label="申请中"></el-option>
            <el-option :value="1" label="同意"></el-option>
            <el-option :value="-1" label="不同意"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isOpen || formItemCount >= 9" label="审批流程状态" prop="flowStatus">
          <el-select
            style="width: 200px"
            placeholder="审批流程状态"
            v-model="dataForm.flowStatus"
            clearable
          >
            <el-option :value="0" label="审批中"></el-option>
            <el-option :value="1" label="已通过"></el-option>
            <el-option :value="-1" label="已驳回"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="isOpen || formItemCount >= 10" label="退款状态" prop="refundStatus">
          <el-select
            style="width: 200px"
            placeholder="退款状态"
            v-model="dataForm.refundStatus"
            clearable
          >
            <el-option :value="-2" label="待退款"></el-option>
            <el-option :value="0" label="退款中"></el-option>
            <el-option :value="1" label="退款成功"></el-option>
            <el-option :value="-1" label="退款失败"></el-option>
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
              <!-- <el-button 
                type="warning"
                plain
                icon="el-icon-download" 
                size="mini"
                @click="exportHandle">{{ $t("export") }}</el-button> -->
            </el-form-item>
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="small" icon="el-icon-refresh" circle @click="query"></el-button>
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
          label="退款单号"
          min-width="200px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="userName"
          label="用户昵称"
          header-align="center"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          prop="userPhone"
          label="手机号码"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="productType"
          label="商品类型"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="productName"
          label="商品名称"
          min-width="150px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          prop="num"
          label="商品数量"
          min-width="150px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="payPrice"
          label="支付金额"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              ￥{{row.payPrice}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="payType"
          label="退款方式"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="refundPrice"
          label="退款金额"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              ￥{{row.refundPrice}}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="productTypeNum"
          label="申请类型"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              {{row.productTypeNum === 1 || row.productTypeNum === 3 ? '仅退款' : '退货退款'}}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="refundReason"
          label="退款原因"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column> -->
        <el-table-column
          prop="confirmStatus"
          label="审批节点状态"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              {{row.confirmStatus === 0 ? '申请中' : row.confirmStatus === -1 ? '不同意' : row.confirmStatus === 1 ? '同意' : '--'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="flowStatus"
          label="审批流程状态"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              {{row.flowStatus === 0 ? '审批中' : row.flowStatus === -1 ? '已驳回' : row.flowStatus === 1 ? '已通过' : '--'}}
            </div>
          </template>
        </el-table-column>
        

        <el-table-column
          prop="refundStatus"
          label="退款状态"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.refundStatus === 1
                  ? "退款成功"
                  : scope.row.refundStatus === -1
                  ? "退款失败"
                  : scope.row.refundStatus === -2
                  ? "待退款"
                  : "退款中"
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="weixinUserProductId"
          label="关联订单编号"
          min-width="180px"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="approveReason"
          label="备注"
          min-width="180px"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column> -->
        <el-table-column
          prop="createDate"
          label="创建时间"
          min-width="160px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-position"
              v-if="scope.row.flowStatus === 1 && (scope.row.refundStatus === -2 || scope.row.refundStatus === -1)"
              @click="updateApproveStatus(scope.row.id)"
              >确认退款</el-button
            >
            <el-button
              v-if="scope.row.flowStatus === 0"
              type="text"
              size="small"
              icon="el-icon-edit-outline"
              @click="showDialog(scope.row.id)"
              >审批</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-edit-outline"
              @click="showDialogWithRemark(scope.row)"
              >查看</el-button
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
            :maxlength="100"
            show-word-limit
            v-model="ruleForm.desc"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="refoundApproveStatus(refundId, -1)">驳 回</el-button>
        <el-button size="small" type="primary" @click="refoundApproveStatus(refundId, 1)"
          >通 过</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="查看" :visible.sync="dialogFormWithRemarkVisible">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="small"
      >
        <el-form-item label="退款原因">
          <div>{{infoWithDialogForm.refundReason || '--'}}</div>
        </el-form-item>
        <el-form-item label="运营备注" prop="desc">
          <div>{{infoWithDialogForm.approveReason || '--'}}</div>
        </el-form-item>
        <el-form-item label="财务备注" prop="desc">
          <div>{{infoWithDialogForm.confirmReason || '--'}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormWithRemarkVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import { addDynamicRoute } from "@/router";
import Template from "../devtools/template.vue";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/userRefund/confirmRefundPage",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/manage/complaint/export",
      },
      dataForm: {
        userName: "",
        userPhone: "",
        productName: "",
        productType: "",
        payType: "",
        weixinUserProductId: "",
        id: "",
        refundStatus: "",
        confirmStatus:"",
        flowStatus:""
      },
      dataList: [{ createDate: 1 }],
      userId: "",
      dialogFormVisible:false,
      ruleForm: {
        desc: "",
      },
      refundId:"",
      dialogFormWithRemarkVisible: false,
      infoWithDialogForm: {}
    };
  },
  components: { Template },
  mounted() {
    this.$bus.$on("change", () => {
      this.getDataList();
    });
  },
  methods: {
    // 重置搜索条件
    resetDataForm() {
      this.dataForm = {
        userName: "",
        userPhone: "",
        productName: "",
        productType: "",
        payType: "",
        weixinUserProductId: "",
        id: "",
        refundStatus: "",
      };
      this.$refs.salesRecord.resetFields();
      this.getDataList();
    },
    // 确认退款
    updateApproveStatus(id, status) {
      this.$confirm(`是否执行退款操作`, this.$t("prompt.title"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning",
      })
        .then(() => {
          this.$http["put"]("/sys/userRefund/updateRefundStatus", {
            id,
          })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.getDataList();
              this.$message.success("操作成功");
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    //审批
    showDialog(id) {
      this.refundId = id;
      this.dialogFormVisible = true;
    },
    showDialogWithRemark(remarkInfo) {
      this.infoWithDialogForm = remarkInfo;
      this.dialogFormWithRemarkVisible = true;
    },
    // 确认审核
    refoundApproveStatus(id, status) {
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
          this.$http["put"]("/sys/userRefund/updateConfirmStatus", {
            id,
            confirmStatus: status,
            confirmReason: this.ruleForm.desc,
          })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.getDataList();
              this.$message.success("操作成功");
              this.ruleForm.desc = "";
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