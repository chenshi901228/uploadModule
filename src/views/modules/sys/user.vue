<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__user">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        label-width="100px"
        label-position="right"
        @keyup.enter.native="getDataList"
      >
        <el-form-item :label="$t('user.username')" prop="username">
          <el-input
            v-model="dataForm.username"
            :placeholder="$t('user.username')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.gender')" prop="gender">
          <ren-select
            v-model="dataForm.gender"
            dict-type="gender"
            :placeholder="$t('user.gender')"
          ></ren-select>
        </el-form-item>
        <el-form-item :label="$t('dept.title')" prop="deptId">
          <ren-dept-tree
            v-model="dataForm.deptId"
            :placeholder="$t('dept.title')"
            :query="true"
          ></ren-dept-tree>
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
            <!-- <el-button size="mini" plain @click="open">
              <i :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button> -->
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <el-button
                size="mini"
                v-if="$hasPermission('sys:dict:save')"
                icon="el-icon-plus"
                plain
                type="primary"
                @click="addOrUpdateHandle()"
                >{{ $t("add") }}</el-button
              >
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                v-if="$hasPermission('sys:user:export')"
                size="mini"
                @click="exportHandle"
              >{{ $t("export") }}</el-button>
              <el-button
                size="mini"
                v-if="$hasPermission('sys:dict:delete')"
                icon="el-icon-delete"
                plain
                type="danger"
                @click="deleteHandle()"
                >{{ $t("deleteBatch") }}</el-button>
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
        @sort-change="dataListSortChangeHandle"
        :height="siteContentViewHeight"
        ref="table"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="username"
          :label="$t('user.username')"
          sortable="custom"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="deptName"
          :label="$t('user.deptName')"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="email"
          :label="$t('user.email')"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="mobile"
          :label="$t('user.mobile')"
          sortable="custom"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="gender"
          :label="$t('user.gender')"
          sortable="custom"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ $getDictLabel("gender", scope.row.gender) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('user.status')"
          sortable="custom"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="danger">{{
              $t("user.status0")
            }}</el-tag>
            <el-tag v-else size="small" type="success">{{
              $t("user.status1")
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          :label="$t('user.createDate')"
          sortable="custom"
          header-align="center"
          align="center"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              v-if="$hasPermission('sys:user:update')"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="addOrUpdateHandle(scope.row.id)"
              >{{ $t("update") }}</el-button
            >
            <el-button
              v-if="$hasPermission('sys:user:delete')"
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteHandle(scope.row.id)"
              >{{ $t("delete") }}</el-button
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
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getDataList"
      ></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import AddOrUpdate from "./user-add-or-update";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/user/page",
        getDataListIsPage: true,
        deleteURL: "/sys/user",
        deleteIsBatch: true,
        exportURL: "/sys/user/export",
      },
      dataForm: {
        username: "",
        deptId: "",
        postId: "",
        gender: "",
      },
    };
  },
  components: {
    AddOrUpdate,
  },
  created() {},
  methods: {},
};
</script>
