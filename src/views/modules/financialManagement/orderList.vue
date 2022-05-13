<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="getDataList()"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户昵称" prop="userName">
              <el-input
                size="small"
                v-model="dataForm.userName"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="userPhone">
              <el-input
                size="small"
                v-model="dataForm.userPhone"
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
                  <!-- <el-input
                  size="small"
                  v-model="dataForm.productType"
                  clearable
                /> -->
                  <el-select
                    size="small"
                    v-model="dataForm.productType"
                    clearable
                  >
                    <el-option value="专业课" label="专业课"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="支付方式" prop="payType">
                  <!-- <el-input
                    size="small"
                    v-model="dataForm.payType"
                    clearable
                  /> -->
                  <el-select size="small" v-model="dataForm.payType" clearable>
                    <el-option value="微信" label="微信"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="消费来源" prop="consumptionSource">
                  <!-- <el-input
                    size="small"
                    v-model="dataForm.consumptionSource"
                    clearable
                  /> -->
                  <el-select
                    size="small"
                    v-model="dataForm.consumptionSource"
                    clearable
                  >
                    <el-option value="小程序端" label="小程序端"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="订单状态" prop="status">
                  <el-select size="small" v-model="dataForm.status" clearable>
                    <el-option :value="0" label="待支付"></el-option>
                    <el-option :value="1" label="已支付"></el-option>
                    <el-option :value="2" label="已完成"></el-option>
                    <el-option :value="3" label="退款中"></el-option>
                    <el-option :value="4" label="已退款"></el-option>
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
          label="订单编号"
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
          label="支付方式"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="consumptionSource"
          label="消费来源"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="payDate"
          label="支付完成时间"
          min-width="160px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="statusStr"
          label="订单状态"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="productId"
          label="关联产品编号"
          min-width="120px"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="下单时间"
          min-width="160px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
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
        getDataListURL: "/sys/finance/user/product/userOrderPage",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/finance/user/product/userOrderExport",
      },
      dataForm: {
        userName: "",
        userPhone: "",
        productName: "",
        productType: "",
        payType: "",
        consumptionSource: "",
        status: "",
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