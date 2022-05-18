<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        label-width="100px"
        size="small"
        ref="fanGroupRevenue"
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
        <el-form-item v-if="isOpen || formItemCount >= 2" label="用户手机号码" prop="userPhone">
          <el-input
            style="width: 200px"
            placeholder="用户手机号码"
            v-model="dataForm.userPhone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 3" label="粉丝团名称" prop="title">
          <el-input
            style="width: 200px"
            placeholder="粉丝团名称"
            v-model="dataForm.title"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 4" label="主播" prop="anchorName">
          <el-input
            style="width: 200px"
            placeholder="主播"
            v-model="dataForm.anchorName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 5" label="主播手机号码" prop="anchorPhone">
          <el-input
            style="width: 200px"
            placeholder="主播手机号码"
            v-model="dataForm.anchorPhone"
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
          prop="id"
          label="收入记录编号"
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
          prop="type"
          label="消费类型"
          header-align="center"
          align="center"
          width="120"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="title"
          label="粉丝团名称"
          header-align="center"
          align="center"
          width="120"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          prop="anchorName"
          label="主播"
          header-align="center"
          show-overflow-tooltip
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="anchorPhone"
          label="手机号码"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          prop="price"
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
          <template slot-scope="scope">
            <div>
              {{ scope.row.payType === 1 ? "微信" : "支付宝" }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="createDate"
          label="创建时间"
          min-width="160px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
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
        getDataListURL:
          "/sys/user/consumption/selectUserJoinFansPageWithFinance",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL:
          "/sys/user/consumption/selectUserJoinFansPageWithFinanceExport",
      },
      dataForm: {
        userName: "",
        userPhone: "",
        title: "",
        anchorName: "",
        anchorPhone: "",
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

    // 重置搜索条件
    resetDataForm() {
      this.dataForm = {
        userName: "",
        userPhone: "",
        title: "",
        anchorName: "",
        anchorPhone: "",
      };
      this.$refs.fanGroupRevenue.resetFields();
      this.getDataList();
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