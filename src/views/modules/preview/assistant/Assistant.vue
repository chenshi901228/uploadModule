// 助手
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
          label="助手昵称"
          prop="level"
          v-if="isOpen || formItemCount >= 1"
        >
          <el-input
            placeholder="请输入"
            style="width: 200px"
            clearable
            v-model="dataForm.productName"
          />
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="level"
          v-if="isOpen || formItemCount >= 2"
        >
          <el-input
            placeholder="请输入"
            style="width: 200px"
            clearable
            v-model="dataForm.productName"
          />
        </el-form-item>
        <el-form-item
          label="添加状态"
          prop="levelName"
          v-if="isOpen || formItemCount >= 3"
        >
          <el-select
            placeholder="请选择"
            style="width: 200px"
            v-model="dataForm.level"
            clearable
          >
            <el-option :value="1" label="已添加"></el-option>
            <el-option :value="0" label="未添加"></el-option>
          </el-select>
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
          <div class="headerTool--handle-btns-left"></div>
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
                  @click="getDataList"
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
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column
          prop="level"
          label="助手昵称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="levelName"
          label="手机号码"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="intimacyNum"
          label="更新时间"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="delFlg"
          label="添加状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.delFlg ? "删除" : "正常" }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete"
              type="text"
              size="small"
              @click="deleteSelect(scope.row)"
              >删除</el-button
            >
            <el-button
              icon="el-icon-upload2"
              type="text"
              size="small"
              @click="toTop(scope.row)"
              >添加</el-button
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

    <el-dialog title="提醒" :visible.sync="dialogVisible" width="30%">
      <span>确定删除该主播推荐</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmDelete"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import debounce from "lodash/debounce";
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
  components: {},
  methods: {
    //批量添加
    addProduct() {},
    //删除
    deleteSelect(row) {},
    //置顶
    toTop(row) {},
    //添加
    add(row) {},
    //确认删除
    confirmDelete() {},
    // 获取粉丝等级
    getFansLevels(type) {
      if (!type) return;
      this.$http
        .get("/sys/sysfanslevel/getLevelList")
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.fansLevelsOptions = res.data;
          } else {
            this.fansLevelsOptions = [];
            return this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.fansLevelsOptions = [];
          this.$message.error(JSON.stringify(err));
        });
    },
  },
};
</script>
