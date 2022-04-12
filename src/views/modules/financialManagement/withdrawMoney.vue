<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="withdrawMoney"
        @keyup.enter.native="getDataList()"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="主播昵称" prop="nickName">
              <el-input
                size="small"
                v-model="dataForm.nickName"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="phone">
              <el-input
                size="small"
                v-model="dataForm.phone"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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

        <div v-if="isOpen">
          <el-row type="flex" justify="start">
        
            <el-col :span="6">
              <el-form-item label="手机号码" prop="phone">
              <el-input
                size="small"
                v-model="dataForm.phone"
                clearable
              ></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="身份证号" prop="phone">
              <el-input
                size="small"
                v-model="dataForm.phone"
                clearable
              ></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="提现状态" prop="delFlg">
                <el-select
                  size="small"
                  v-model="dataForm.handlingStatus"
                  clearable
                >
                  <el-option :value="1" label="已处理"></el-option>
                  <el-option :value="0" label="未处理"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
        
          </el-row>
        </div>
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
          prop="username"
          label="主播昵称"
          header-align="center"
          align="center"
          min-width="120px"
        ></el-table-column>
<el-table-column
          prop="phone"
          label="真实姓名"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          min-width="120px"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="身份证号"
          min-width="200px"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="账户名称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="银行账号"
          min-width="180px"
          header-align="center"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="solution"
          label="开户银行"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="handler"
          label="支行名称"
          min-width="120px"

          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
         <el-table-column
          prop="handler"
          label="开户行所在地"
          min-width="180px"

          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
      
         <el-table-column
          prop="handler"
          label="提现金额"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
         <el-table-column
          prop="handler"
          label="到账金额"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
    
        <el-table-column
          prop="createDate"
          label="申请时间"
          min-width="160px"
          header-align="center"
          align="center"
        >
        </el-table-column>
 <el-table-column
          prop="handlingStatus"
          label="提现状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.handlingStatus === 1
                  ? "待打款"
                  : scope.row.handlingStatus === 2
                  ? "未到账"
                  : "已到账"
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
            <el-button type="text" size="small" v-if="scope.row.handlingStatus === 1"
              >确认打款</el-button
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
        getDataListURL: "/sys/manage/complaint/page",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/manage/complaint/export",
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
    },

    // 重置搜索条件
    resetDataForm() {
      this.$refs.withdrawMoney.resetFields();
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