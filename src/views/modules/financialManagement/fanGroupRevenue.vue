<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="fanGroupRevenue"
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
           <el-form-item label="消费来源" prop="paySource">
                   <el-select
                    size="small"
                    v-model="dataForm.paySource"
                    clearable
                  >
                    <el-option :value="1" label="小程序"></el-option>
                    <el-option :value="2" label="大于众学"></el-option>
                  </el-select>
                </el-form-item>
          </el-col>
     
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
          label="收入记录编号"
          min-width="200px"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="userName"
          label="用户昵称"
          header-align="center"
          align="center"
          min-width="120px"
        ></el-table-column>

        <el-table-column
          prop="userPhone"
          label="手机号码"
          min-width="120px"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="消费类型"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="title"
          label="粉丝团名称"
          header-align="center"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="anchorName"
          label="主播"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="anchorPhone"
          label="手机号码"
          min-width="120px"
          header-align="center"
          align="center"
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
        >
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
        getDataListURL: "/sys/user/consumption/selectUserJoinFansPageWithFinance",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/user/consumption/selectUserJoinFansPageWithFinanceExport",
      },
      dataForm: {
        nickName: "",
        phone: "",
        delFlg: "",
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