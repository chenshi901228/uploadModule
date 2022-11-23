<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="complainsRecords"
        size="small"
        label-width="100px"
        @keyup.enter.native="getDataList"
      >
        <el-form-item v-show="isOpen || formItemCount >= 1" label="用户" prop="nickName">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.nickName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 2" label="问题描述" prop="content">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.content"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 2" label="主播" prop="content">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.anchorRealName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 3" label="直播间名称" prop="liveTheme">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.liveTheme"
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
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>

        <el-table-column
          prop="nickName"
          label="用户昵称"
          header-align="center"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          header-align="center"
          align="center"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="content"
          label="问题描述"
          header-align="center"
          align="center"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="提问时间"
          header-align="center"
          align="center"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="anchorNickName"
          label="主播昵称"
          header-align="center"
          align="center"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="anchorRealName"
          label="主播姓名"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="anchorPhone"
          label="手机号码"
          header-align="center"
          align="center"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="liveTheme"
          label="直播间名称"
          header-align="center"
          align="center"
          width="180"
          show-overflow-tooltip
        >
        </el-table-column>
        
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-button icon="el-icon-document" type="text" size="small" @click="handleClick(scope.row)"
              >查看详情</el-button
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
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/liveAsk/selectPage",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/liveAsk/export",
      },
      dataForm: {
        nickName: "",
        liveTheme: "",
        content: "",
        anchorRealName:"",
      },
      dataList: [],
    };
  },
  mounted() {
    this.$bus.$on("change", () => {
      this.getDataList();
    });
  },
  methods: {
    handleClick({ content }){
        this.$alert(content || '暂无详情', '提问详情', {
            confirmButtonText: '关闭',
            callback: action => {}
        });
    },
    // 重置搜索条件
    resetDataForm() {
      this.$refs.complainsRecords.resetFields();
      this.getDataList();
    },
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

.el-table {
  /deep/tbody tr:hover > td {
    width: 90%;
  }
}
</style>