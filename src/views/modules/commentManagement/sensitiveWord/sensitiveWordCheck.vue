<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="sensitiveWordCheck"
        size="small"
        label-width="100px"
        @keyup.enter.native="getDataList"
      >
        <el-form-item v-if="isOpen || formItemCount >= 1" label="用户昵称" prop="nickName">
          <el-input
            style="width: 200px"
            placeholder="用户昵称"
            v-model="dataForm.nickName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 2" label="手机号码" prop="phone">
          <el-input
            style="width: 200px"
            placeholder="手机号码"
            v-model="dataForm.phone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 3" label="待审核内容" prop="delFlg">
          <el-input 
            style="width: 200px"
            placeholder="待审核内容" 
            v-model="dataForm.content" 
            clearable />
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 4" label="审核状态" prop="checkStatus">
          <el-select
            style="width: 200px"
            placeholder="审核状态"
            v-model="dataForm.checkStatus"
            clearable
          >
            <el-option :value="1" label="通过"></el-option>
            <el-option :value="2" label="待审核"></el-option>
            <el-option :value="4" label="驳回"></el-option>
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
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="checkType"
          label="审核类型"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.checkType === 1
                  ? "直播提问"
                  : scope.row.checkType === 2
                  ? "视频评论"
                  : "评论回复"
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="审核内容"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="checkStatus"
          label="审核状态"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.checkStatus === 1
                  ? "通过"
                  : scope.row.checkStatus === 2
                  ? "待审核"
                  : scope.row.checkStatus === 3
                  ? "建议屏蔽":'驳回'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          header-align="center"
          align="center"
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
            <el-button type="text" icon="el-icon-document" size="small" @click="openDetail(scope.row)"
              >详情</el-button
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
import Template from "../../devtools/template.vue";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/sensitiveWordCheck/page",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/sensitiveWordCheck/exportSensitiveWord",
      },
      dataForm: {
        nickName: "",
        phone: "",
        delFlg: "",
        checkStatus:""
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
    // 打开用户详情弹窗
    openDetail(data) {
      this.$router.push({
        name: "commentManagement-sensitiveWord-sensitiveWordDetail",
      });
      window.localStorage.setItem("sensitiveWordDetailID", data.id);
    },

    forbiddenAll() {
      console.log(this.dataListSelections);
    },
    // 禁用，解除用户
    forbidden(id) {},

    // 重置搜索条件
    resetDataForm() {
      this.dataForm = {
        nickName: "",
        phone: "",
        delFlg: "",
        checkStatus:""
      }
      this.$refs.sensitiveWordCheck.resetFields();
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