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
        <el-form-item v-show="isOpen || formItemCount >= 1" label="用户昵称" prop="userName">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.userName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 2" label="手机号码" prop="userPhone">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.userPhone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 3" label="商品名称" prop="productName">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.productName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 4" label="商品类型" prop="productType">
          <el-select
            style="width: 200px"
            placeholder="请选择"
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
        <el-form-item v-show="isOpen || formItemCount >= 5" label="退款方式" prop="payType">
          <el-select style="width: 200px" placeholder="请选择" v-model="dataForm.payType" clearable>
            <el-option value="微信" label="微信"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 6" label="关联订单编号" prop="weixinUserProductId">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.weixinUserProductId"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 7" label="退款单号" prop="id">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.id"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="isOpen || formItemCount >= 8" label="审批节点状态" prop="confirmStatus">
          <el-select
            style="width: 200px"
            placeholder="请选择"
            v-model="dataForm.confirmStatus"
            clearable
          >
            <el-option :value="0" label="待审批"></el-option>
            <el-option :value="1" label="已通过"></el-option>
            <el-option :value="-1" label="未通过"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-show="isOpen || formItemCount >= 9" label="审批流程状态" prop="flowStatus">
          <el-select
            style="width: 200px"
            placeholder="请选择"
            v-model="dataForm.flowStatus"
            clearable
          >
            <el-option :value="0" label="审批中"></el-option>
            <el-option :value="1" label="已通过"></el-option>
            <el-option :value="-1" label="已驳回"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-show="isOpen || formItemCount >= 10" label="退款状态" prop="refundStatus">
          <el-select
            style="width: 200px"
            placeholder="请选择"
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
              {{row.productTypeNum != 2 ? "仅退款" : row.productTypeNum == 2 && row.useStatus == 0 ? "仅退款" : "退货退款"}}
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
          width="150px"
        >
          <template slot-scope="{ row }">
            <div>
              <el-tag :type="
                row.confirmStatus === 1 ? 'success' 
                : row.confirmStatus === -1 ? 'danger': 'warning'">
                {{
                  row.confirmStatus === 1
                  ? "已通过"
                  : row.confirmStatus === -1
                  ? "未通过"
                  : "待审批"
                }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="flowStatus"
          label="审批流程状态"
          header-align="center"
          show-overflow-tooltip
          align="center"
          width="150px"
        >
          <template slot-scope="{ row }">
            <div>
              <el-tag :type="
                row.flowStatus === 1 ? 'success' 
                : row.flowStatus === -1 ? 'danger': 'warning'">
                {{
                  row.flowStatus === 1
                  ? "已通过"
                  : row.flowStatus === -1
                  ? "已驳回"
                  : "审批中"
                }}
              </el-tag>
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
              icon="el-icon-edit-outline"
              @click="showDialogWithRemark(scope.row)"
              >查看</el-button>
            <el-button
              type="text"
              size="small"
              icon="el-icon-position"
              v-if="scope.row.flowStatus === 1 && (scope.row.refundStatus === -2 || scope.row.refundStatus === -1)"
              @click="updateApproveStatus(scope.row.id)"
              >确认退款</el-button>
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

    <el-dialog title="查看" :visible.sync="dialogFormWithRemarkVisible" @close="closeHandle">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="small"
      >
        <el-form-item label="退款原因：">
          <div>{{infoWithDialogForm.refundReason || '--'}}</div>
        </el-form-item>
        <el-form-item label="运营备注：">
          <div>{{infoWithDialogForm.approveReason || '--'}}</div>
        </el-form-item>
        <!-- 审批 -->
        <el-form-item label="备注：" prop="desc" v-if="infoWithDialogForm.flowStatus === 0">
          <el-input
            placeholder="请输入,可不填"
            type="textarea"
            :maxlength="100"
            show-word-limit
            v-model="ruleForm.desc"
          ></el-input>
        </el-form-item>
        <!-- 仅查看 -->
        <el-form-item label="财务备注：" v-else>
          <div>{{infoWithDialogForm.confirmReason || '--'}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- 可审批 -->
        <el-button :disabled="submitLoading" :loading="submitLoading && submitStatus == -1" v-if="infoWithDialogForm.flowStatus === 0" size="small" @click="refoundApproveStatus(infoWithDialogForm.id, -1)">驳 回</el-button>
        <el-button :disabled="submitLoading" :loading="submitLoading && submitStatus == 1" v-if="infoWithDialogForm.flowStatus === 0" size="small" type="primary" @click="refoundApproveStatus(infoWithDialogForm.id, 1)">通 过</el-button>
        <!-- 仅查看 -->
        <el-button v-if="infoWithDialogForm.flowStatus != 0" @click="dialogFormWithRemarkVisible = false" size="small">关 闭</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import debounce from "lodash/debounce"
import mixinViewModule from "@/mixins/view-module";
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
      dataList: [],
      userId: "",
      ruleForm: {
        desc: "",
      },
      dialogFormWithRemarkVisible: false,
      infoWithDialogForm: {},
      submitLoading: false, //审核loading
      submitStatus: 1, //通过/驳回
    };
  },
  components: { Template },
  mounted() {
    this.$bus.$on("change", () => {
      this.getDataList();
    });
  },
  methods: {
    // 弹框关闭
    closeHandle() {
      this.ruleForm.desc = "";
      this.infoWithDialogForm = {}
    },
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
      this.$confirm("确认向该用户退款？", "确认退款", {
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
              this.$message.success("操作成功");
              this.query();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // 审批/查看
    showDialogWithRemark(remarkInfo) {
      this.infoWithDialogForm = remarkInfo;
      this.dialogFormWithRemarkVisible = true;
    },
    // 确认审核
    refoundApproveStatus: debounce(function(id, status) {
      this.submitStatus = status
      this.submitLoading = true
      this.$http["put"]("/sys/userRefund/updateConfirmStatus", {
        id,
        confirmStatus: status,
        confirmReason: this.ruleForm.desc,
      })
        .then(({ data: res }) => {
          this.submitLoading = false
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message.success("操作成功");
          this.dialogFormWithRemarkVisible = false;
          this.query();
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
          this.submitLoading = false
        });
    }, 1500, { 'leading': true, 'trailing': false }),
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