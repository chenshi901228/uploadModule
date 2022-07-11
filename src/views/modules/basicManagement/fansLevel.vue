<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-fansLevel">
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
        <el-form-item
          label="等级"
          prop="level"
          v-if="isOpen || formItemCount >= 1"
        >
          <el-select placeholder="等级" @visible-change="getFansLevels" style="width: 200px" v-model="dataForm.level" clearable>
            <el-option v-for="item in fansLevelsOptions" :key="item" :value="item" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="等级名称"
          prop="levelName"
          v-if="isOpen || formItemCount >= 2"
        >
          <el-input placeholder="等级名称" style="width: 200px" clearable v-model="dataForm.levelName">
          </el-input>
        </el-form-item>
        <div class="headerTool-search-btns">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getDataList"
              >{{ $t("query") }}</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetDataForm()"
              >{{ $t("reset") }}</el-button
            >
            <el-button size="mini" plain @click="open">
              <i
                :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button>
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="addOrUpdateHandle()"
                >{{ $t("add") }}</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="exportHandle"
                >{{ $t("export") }}</el-button
              >
            </el-form-item>
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip
                class="item"
                effect="dark"
                content="刷新"
                placement="top"
              >
                <el-button
                  size="small"
                  icon="el-icon-refresh"
                  circle
                  @click="query"
                ></el-button>
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
            {{ scope.row.delFlg ? "删除" : "正常" }}
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
              icon="el-icon-edit"
              type="text"
              size="small"
              @click="addOrUpdateHandle(scope.row.id)"
              >{{ $t("update") }}</el-button
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
        @refreshDataList="query"
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
      giftOptions: [], //礼物下拉选择内容
      fansLevelsOptions: [], //粉丝等级options
    };
  },
  watch: {},
  components: {
    AddOrUpdate,
  },
  methods: {
    // 获取粉丝等级
    getFansLevels(type) {
      if(!type) return
      this.$http.get("/sys/sysfanslevel/getLevelList").then(({data: res}) => {
        if(res.code == 0) {
          this.fansLevelsOptions = res.data
        }else {
          this.fansLevelsOptions = []
          return this.$message.error(res.msg)
        }
      }).catch(err => {
        this.fansLevelsOptions = []
        this.$message.error(JSON.stringify(err))
      })
    },
  },
};
</script>
