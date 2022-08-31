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
        <el-form-item v-show="isOpen || formItemCount >= 1" label="主播昵称" prop="sendUserName">
          <el-input
            style="width: 200px"
            v-model="dataForm.sendUserName"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 2" label="主播手机号码" prop="sendUserPhone">
          <el-input
            style="width: 200px"
            v-model="dataForm.sendUserPhone"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 3" label="用户昵称" prop="toUserName">
          <el-input
            style="width: 200px"
            v-model="dataForm.toUserName"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 4" label="用户手机号码" prop="toUserPhone">
          <el-input
            style="width: 200px"
            v-model="dataForm.toUserPhone"
            clearable
            placeholder="请输入"
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
          prop="sendUserName"
          label="主播昵称"
          min-width="200px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="sendUserPhone"
          label="主播手机号码"
          min-width="200px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            prop="toUserName"
            label="用户昵称"
            min-width="200px"
            header-align="center"
            align="center"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            prop="toUserPhone"
            label="用户手机号码"
            min-width="200px"
            header-align="center"
            align="center"
            show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createDate"
          label="更新时间"
          min-width="200px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="200"
        >
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              icon="el-icon-view"
              @click="lookHandle(row)"
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
        getDataListURL: "/sys/imCallback/getInfoPage",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/imCallback/exportList",
      },
      dataForm: {
        sendUserName:"",
        sendUserPhone:"",
        toUserName:"",
        toUserPhone:""
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
    lookHandle(row){
        this.$router.push({
            path:"/serviceRecord-serviceList",
            query:{info:JSON.stringify(row)}
        })
    }
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