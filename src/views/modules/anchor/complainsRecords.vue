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
        <el-form-item v-if="isOpen || formItemCount >= 1" label="用户昵称" prop="nickName">
          <el-input
            style="width: 200px"
            placeholder="用户昵称"
            v-model="dataForm.username"
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
      
        <el-form-item v-if="isOpen || formItemCount >= 3" label="投诉分类" prop="type">
          <el-select 
            style="width: 200px"
            placeholder="投诉分类" 
            v-model="dataForm.type" 
            clearable>
            <el-option :value="1" label="平台投诉"></el-option>
            <el-option :value="2" label="直播间投诉"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 4" label="投诉标签" prop="tag">
          <el-select 
            style="width: 200px"
            placeholder="投诉标签" 
            v-model="dataForm.tag" 
            clearable>
            <el-option value="违法违禁" label="违法违禁"></el-option>
            <el-option value="淫秽色情" label="淫秽色情"></el-option>
            <el-option value="欺诈/售假" label="欺诈/售假"></el-option>
            <el-option
              value="未成年人相关"
              label="未成年人相关"
            ></el-option>
            <el-option value="危险行为" label="危险行为"></el-option>
            <el-option value="录像/盗播" label="录像/盗播"></el-option>
            <el-option
              value="引导线下转账"
              label="引导线下转账"
            ></el-option>
            <el-option value="诱导刷礼" label="诱导刷礼"></el-option>
            <el-option value="侮辱谩骂" label="侮辱谩骂"></el-option>
            <el-option value="其他" label="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 5" label="处理状态" prop="handlingStatus">
          <el-select
            style="width: 200px"
            placeholder="处理状态"
            v-model="dataForm.handlingStatus"
            clearable
          >
            <el-option :value="1" label="已处理"></el-option>
            <el-option :value="0" label="未处理"></el-option>
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
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>

        <el-table-column
          prop="username"
          label="用户昵称"
          header-align="center"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          min-width="120px"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="投诉分类"
          header-align="center"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.type == 1 ? "平台投诉" : "直播间投诉" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="投诉标签"
          header-align="center"
          align="center"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="content"
          label="投诉内容"
          header-align="center"
          show-overflow-tooltip
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="contactPhone"
          label="联系电话"
          min-width="120px"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="投诉时间"
          min-width="180px"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="solution"
          label="处理方案"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="handler"
          label="处理人"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="handlingTime"
          label="处理时间"
          min-width="180px"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="handlingStatus"
          label="处理状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.handlingStatus ? "已处理" : "未处理" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="liveId"
          label="关联直播间"
          header-align="center"
          align="center"
          width="180"
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
            <el-button icon="el-icon-document" type="text" size="small" @click="openDetail(scope.row)"
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
        handlingStatus: "",
        type: "",
        tag: "",
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
        name: "anchor-complainsDetail",
      });
      window.localStorage.setItem("complainsDetailID", data.id);
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
        handlingStatus: "",
        type: "",
        tag: "",
      };
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