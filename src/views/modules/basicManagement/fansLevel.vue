<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-fansLevel">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        @keyup.enter.native="getDataList"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="等级" prop="level">
              <el-input
                clearable
                v-model="dataForm.level"
              >
        
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="等级名称" prop="levelName">
                   <el-input
                clearable
                v-model="dataForm.levelName"
              >
        
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="float: right; padding-right: 10px">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="addOrUpdateHandle()"
                >{{ $t("add") }}</el-button
              >
              <el-button size="small" type="info" @click="exportHandle()">{{
                $t("export")
              }}</el-button>
              <el-button size="small" type="primary" @click="getDataList">{{
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
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="level"
          label="等级"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="levelName"
          label="等级名称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="intimacyNum"
          label="亲密值要求"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="delFlg"
          label="状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.delFlg?'删除':'正常'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          header-align="center"
          align="center"
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
              type="text"
              size="small"
              @click="addOrUpdateHandle(scope.row.id)"
              >{{ $t("update") }}</el-button
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
import debounce from "lodash/debounce";
import AddOrUpdate from "./fansLevel-add-or-update";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/sysfanslevel/page",
        getDataListIsPage: true,
        exportURL: "/sys/sysfanslevel/export",
        deleteURL: "/sys/sysfanslevel",
        deleteIsBatch: true,
      },
      dataForm: {
        name: "",
        isFree: null,
        status: null,
      },
      loading: false, //礼物输入下拉选择loading
      giftOptions: [] //礼物下拉选择内容
    };
  },
  watch: {},
  components: {
    AddOrUpdate,
  },
  methods: {

    
  },
};
</script>
