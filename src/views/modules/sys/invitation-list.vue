
<!-- 分享记录 -->

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-shareRecord">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="shareRecord"
        size="small"
        label-width="120px"
        @keyup.enter.native="getDataList"
      >
        <el-form-item v-show="isOpen || formItemCount >= 1" label="用户昵称" prop="nickName">
          <el-input
            style="width: 190px"
            v-model="dataForm.passiveShareUserName"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 2" label="用户手机号" prop="phone">
          <el-input
            style="width: 200px"
            v-model="dataForm.passiveShareUserTel"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 4" label="邀请人" prop="phone">
          <el-input
            style="width: 200px"
            v-model="dataForm.shareUserName"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 5" label="邀请人手机号码" prop="phone">
          <el-input
            style="width: 200px"
            v-model="dataForm.shareUserTel"
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
          prop="shareType"
          label="日志类型"
          min-width="150px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.shareType === 0
                ? "预告分享"
                : scope.row.shareType === 1
                ? "直播分享"
                : scope.row.shareType === 2
                ? "短视频分享"
                : scope.row.shareType === 3
                ? "主播分享"
                : scope.row.shareType === 4
                ? "店铺分享"
                : scope.row.shareType === 5
                ? "小程序分享"
                : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="passiveShareUserName"
          label="用户昵称"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
          ><template slot-scope="scope">
            <span>{{ scope.row.passiveShareUserName || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="passiveShareUserTel"
          label="手机号码"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
          ><template slot-scope="scope">
            <span>{{ scope.row.passiveShareUserTel || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="shareUserName"
          label="邀请人"
          header-align="center"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="shareUserTel"
          label="邀请人手机号码"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          prop="createDate"
          label="邀请绑定时间"
          min-width="160px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="shareUrl"
          label="页面路由"
          min-width="150px"
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
import { addDynamicRoute } from "@/router";
import Template from "../devtools/template.vue";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/liveShare/page",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/liveShare/export",
      },
      dataForm: {
        passiveShareUserName: "",
        passiveShareUserTel: "",
        shareUserName: "",
        shareUserTel: "",
      },
      dataList: [],
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
        passiveShareUserName: "",
        passiveShareUserTel: "",
        shareUserName: "",
        shareUserTel: "",
      };
      this.$refs.shareRecord.resetFields();
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