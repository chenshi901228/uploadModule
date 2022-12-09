<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="refundApproval"
        size="small"
        label-width="100px"
        @keyup.enter.native="getDataList"
      >
        <el-form-item v-show="isOpen || formItemCount >= 1" label="用户昵称" prop="userName">
          <el-input
            style="width: 200px"
            v-model="dataForm.userName"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 2" label="手机号码" prop="userPhone">
          <el-input
            style="width: 200px"
            v-model="dataForm.userPhone"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 3" label="商品类型" prop="productType">
          <el-select 
            @visible-change="getProductType" 
            style="width: 200px" 
            v-model="dataForm.productType" 
            placeholder="请选择"
            clearable>
              <el-option v-for="item in productTypeOptions" :key="item.productType" :value="item.productType" :label="item.productType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 4" label="商品名称" prop="productName">
          <el-input
            style="width: 200px"
            v-model="dataForm.productName"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 5" label="关联订单编号" prop="weixinUserProductId">
          <el-input
            style="width: 200px"
            v-model="dataForm.weixinUserProductId"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 6" label="审批节点状态" prop="approveStatus">
          <el-select 
            v-model="dataForm.approveStatus"
            style="width: 200px"
            clearable
            placeholder="请选择">
            <el-option :value="1" label="已通过"></el-option>
            <el-option :value="0" label="待审批"></el-option>
            <el-option :value="-1" label="未通过"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 6" label="审批流程状态" prop="flowStatus">
          <el-select 
            v-model="dataForm.flowStatus"
            style="width: 200px"
            clearable
            placeholder="请选择">
            <el-option :value="1" label="已通过"></el-option>
            <el-option :value="0" label="审批中"></el-option>
            <el-option :value="-1" label="已驳回"></el-option>
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
          min-width="120px"
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
        ></el-table-column>
        <el-table-column
          prop="num"
          label="商品数量"
          min-width="100px"
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
            <span>￥{{row.payPrice}}</span>
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
            <span>￥{{row.refundPrice}}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="price"
          label="销售价格"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column> -->
        <el-table-column
          prop="weixinUserProductId"
          label="关联订单编号"
          min-width="200px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="applyType"
          label="申请类型"
          min-width="200px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span>{{row.productTypeNum != 2 ? "仅退款" : row.productTypeNum == 2 && row.useStatus == 0 ? "仅退款" : "退货退款"}}</span>
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
        </el-table-column>

        <el-table-column
          prop="approveDate"
          label="审批时间"
          min-width="160px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column
          prop="refundReason"
          label="退款原因"
          show-overflow-tooltip
          min-width="160px"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="approveReason"
          label="备注"
          show-overflow-tooltip
          min-width="160px"
          header-align="center"
          align="center"
        ></el-table-column> -->

        <el-table-column
          prop="approveStatus"
          label="审批节点状态"
          header-align="center"
          align="center"
          width="150px"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <div>
              <el-tag :type="
                row.approveStatus === 1 ? 'success' 
                : row.approveStatus === -1 ? 'danger': 'warning'">
                {{
                  row.approveStatus === 1
                  ? "已通过"
                  : row.approveStatus === -1
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
          align="center"
          width="150px"
          show-overflow-tooltip
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
              v-if="scope.row.approveStatus === 0"
              @click="updateApproveStatus(scope.row.id, 1)"
              >通过</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="scope.row.approveStatus === 0"
              @click="updateApproveStatus(scope.row.id, -1)"
              >驳回</el-button
            > -->
            <!-- <el-button
              type="text"
              size="small"
              icon="el-icon-edit-outline"
              v-if="scope.row.approveStatus === 0"
              @click="showDialog(scope.row.refundReason,scope.row.id)"
              >审批</el-button
            > -->
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

    <!-- 审批/查看 -->
    <el-dialog title="查看" :visible.sync="dialogFormWithRemarkVisible" @close="closeHandle">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="small"
      >
        <el-form-item label="退款原因：">
          <div>{{remarkWithDialogForm.refundReason || '--'}}</div>
        </el-form-item>
        <el-form-item label="备注：" prop="desc" v-if="remarkWithDialogForm.approveStatus === 0">
          <el-input
            placeholder="请输入,可不填"
            type="textarea"
            :maxlength="100"
            show-word-limit
            v-model="ruleForm.desc"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="desc" v-else>
          <div>{{remarkWithDialogForm.approveReason || '--'}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="submitLoading" :loading="submitLoading && submitStatus == -1" v-if="remarkWithDialogForm.approveStatus === 0" size="small" @click="updateApproveStatus(remarkWithDialogForm.id, -1)">驳 回</el-button>
        <el-button :disabled="submitLoading" :loading="submitLoading && submitStatus == 1" v-if="remarkWithDialogForm.approveStatus === 0" size="small" type="primary" @click="updateApproveStatus(remarkWithDialogForm.id, 1)">通 过</el-button>
        <el-button v-if="remarkWithDialogForm.approveStatus != 0" size="small" @click="dialogFormWithRemarkVisible = false">关 闭</el-button>
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
        getDataListURL: "/sys/userRefund/userRefundOrderPage",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/manage/complaint/export",
      },
      dataForm: {
        userName: "",
        userPhone: "",
        productType: "",
        productName: "",
        weixinUserProductId: "",
        approveStatus: null,
        flowStatus: null
      },
      dataList: [],
      userId: "",
      dialogFormWithRemarkVisible: false,
      ruleForm: {
        desc: "",
      },
      productTypeOptions: [], //商品类型下拉选项
      remarkWithDialogForm: {},
      submitLoading: false, //审核loading
      submitStatus: 1, //通过/驳回
    };
  },
  components: { Template },
  mounted() {
    // this.$bus.$on("change", () => {
    //   this.getDataList();
    // });
  },
  methods: {
    // 审批/查看
    showDialogWithRemark(row) {
      this.remarkWithDialogForm = row;
      this.dialogFormWithRemarkVisible = true;
    },
    // 重置搜索条件
    resetDataForm() {
      this.$refs.refundApproval.resetFields();
      this.getDataList();
    },
    // 下拉获取商品类型
    getProductType(type) {
      if(!type) return
      this.$http.get("/sys/course/searchProductType").then(({data: res}) => {
        if(res.code == 0) {
          this.productTypeOptions = res.data
        }else {
          this.productTypeOptions = []
          return this.$message.error(res.msg)
        }
      }).catch(err => {
        this.productTypeOptions = []
        this.$message.error(JSON.stringify(err))
      })
    },
    // 弹框关闭
    closeHandle() {
      this.ruleForm.desc = ""
      this.remarkWithDialogForm = {}
    },

    // 审核
    updateApproveStatus: debounce(function(id, status) {
      this.submitStatus = status
      this.submitLoading = true
      this.$http["put"]("/sys/userRefund/updateApproveStatus", {
        id,
        approveStatus: status,
        approveReason: this.ruleForm.desc,
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