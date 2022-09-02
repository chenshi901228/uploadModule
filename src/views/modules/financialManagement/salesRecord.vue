<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        label-width="100px"
        size="small"
        @keyup.enter.native="getDataList()"
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
        <el-form-item v-show="isOpen || formItemCount >= 3" label="商品名称" prop="productName">
          <el-input
            style="width: 200px"
            v-model="dataForm.productName"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 4" label="商品类型" prop="productType">
          <el-select
            style="width: 200px"
            v-model="dataForm.productType"
            clearable
            placeholder="请选择"
          >
            <el-option value="专业课" label="专业课"></el-option>
            <el-option value="服务课" label="服务课"></el-option>
            <el-option value="线下课" label="线下课"></el-option>
            <el-option value="权益卡" label="权益卡"></el-option>
            <el-option value="书籍" label="书籍"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 5" label="支付方式" prop="payType">
          <el-select style="width: 200px"  v-model="dataForm.payType" clearable>
            <el-option value="微信" label="微信"></el-option>
            <el-option value="支付宝" label="支付宝"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 6" label="消费来源" prop="consumptionSource">
          <el-select
            style="width: 200px"
            v-model="dataForm.consumptionSource"
            clearable
            placeholder="请选择"
          >
            <el-option value="小程序端" label="小程序端"></el-option>
            <el-option value="大于众学" label="大于众学"></el-option>
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
          label="销售编号"
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
          <template slot-scope="{ row }">
            <span>{{ numberConvert(row.price) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payPrice"
          label="支付金额"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ numberConvert(row.payPrice) }}</span>
          </template>
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
  </el-card>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import Template from "../devtools/template.vue";
import { numberConvert } from "@/utils";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/finance/user/product/orderSalePage",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/finance/user/product/orderSaleExport",
      },
      dataForm: {
          userName: "",
        userPhone: "",
        productName: "",
        productType: "",
        payType: "",
        consumptionSource: "",
      },
      dataList: [{ createDate: 1 }],
      userId: "",
    };
  },
  components: { Template },
  mounted() {
    this.$bus.$on("change", () => {
      this.getDataList();
    });
  },
  methods: {
    // 添加金额符号
    numberConvert(m) {
      return numberConvert(m)
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