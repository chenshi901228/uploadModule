<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="salesRecord"
        label-width="100px"
        @keyup.enter.native="getDataList()"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input
                size="small"
                v-model="dataForm.nickName"
                clearable
              ></el-input>
            </el-form-item>
      
          </el-col>
          <el-col :span="8">
           
            <el-form-item label="手机号码" prop="phouserPhonene">
              <el-input
                size="small"
                v-model="dataForm.phouserPhonene"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
            <el-col :span="8">
              <el-form-item label="商品名称" prop="productName">
                <el-input
                  size="small"
                  v-model="dataForm.productName"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
              <div v-if="isOpen">
          <el-row>
            <el-col :span="8">
              <el-form-item label="商品类型" prop="productType">
                <el-select
                  size="small"
                  v-model="dataForm.productType"
                  clearable
                >
                  <el-option :value="1" label="已处理"></el-option>
                  <el-option :value="0" label="未处理"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退款方式" prop="payType">
                <el-select
                  size="small"
                  v-model="dataForm.payType"
                  clearable
                >
                  <el-option :value="1" label="已处理"></el-option>
                  <el-option :value="0" label="未处理"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="关联订单编号" prop="weixinUserProductId">
                <el-input
                  size="small"
                  v-model="dataForm.weixinUserProductId"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退款单号" prop="id">
                <el-select
                  size="small"
                  v-model="dataForm.id"
                  clearable
                >
                  <el-option :value="1" label="已处理"></el-option>
                  <el-option :value="0" label="未处理"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退款状态" prop="refundStatus">
                <el-select
                  size="small"
                  v-model="dataForm.refundStatus"
                  clearable
                >
                  <el-option :value="1" label="已处理"></el-option>
                  <el-option :value="0" label="未处理"></el-option>
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
          prop="price"
          label="销售价格"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="payPrice"
          label="支付金额"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
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
                  ? "未退款"
                  :'退款中'
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
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="scope.row.refundStatus === -2"
              @click="updateApproveStatus(scope.row.id)"
              >确认退款</el-button
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
        nickName: "",
        phouserPhonene: "",
        productName:"",
        productType:"",
        payType:"",
        weixinUserProductId: "",
        id:"",
        refundStatus:""
      },
      dataList: [{ createDate: 1 }],
      userId: "",

      otherViewHeight: 0, //搜索栏高度
      isOpen: false, //搜索栏展开/收起
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
       this.resetDataForm()
    },

    // 重置搜索条件
    resetDataForm() {
      this.dataForm = {
         nickName: "",
        phouserPhonene: "",
        productName:"",
        productType:"",
        payType:"",
        weixinUserProductId: "",
        id:"",
        refundStatus:""
      }
      this.$refs.salesRecord.resetFields();
      this.getDataList();
    },
        // 确认退款
    updateApproveStatus(id,status) {
      this.$confirm(
        `是否执行退款操作`,
        this.$t("prompt.title"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(() => {
          this.$http["put"]("/sys/userRefund/updateRefundStatus", {
            id,
          })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
               this.getDataList();
              this.$message.success('操作成功');
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