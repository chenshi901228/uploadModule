
<!-- 基础管理-问题列表 -->

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__goodsList">
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
          label="问题标题"
          prop="title"
        >
          <el-input
            :clearable="true"
            style="width: 200px"
            v-model="dataForm.title"
            placeholder="请输入关键字"
          />
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
            <!-- <el-button size="mini" plain @click="open">
              <i
                :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button> -->
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <el-button
                :disabled="!dataListSelections.length"
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteProblem()"
                >批量删除</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                plain
                @click="addOrUpdate()"
                >新增</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                size="mini"
                type="warning"
                plain
                icon="el-icon-download"
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
        <div>问题分类：{{classify}}</div>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        @selection-change="dataListSelectionChangeHandle"
        :height="siteContentViewHeight"
        style="width: 100%"
        @cell-dblclick="dblclick"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
          fixed="left"
        ></el-table-column>

        <el-table-column
          header-align="center"
          align="center"
          v-for="item in tableItem"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
          :sortable="
            ['transcribeFlg', 'liveState', 'showState'].includes(item.prop)
          "
        >
          <template slot-scope="{ row }">
            <!-- 序号 -->
            <div v-if="item.prop == 'num'">
              <el-input
                v-if="sortId === row.id && sortId !== ''"
                size="mini"
                v-model="sortVal"
                placeholder="请输入"
                @blur="sortId = ''"
                :id="'input' + row.id"
                @keyup.enter.native="userSelect"
                type="number"
              ></el-input>
              <span v-else>
                {{ row.num || "--" }}
              </span>
            </div>
            <!-- 标题 -->
            <span v-if="item.prop == 'title'">
              {{ row.title }}
            </span>
            <!-- 更新人 -->
            <span v-else-if="item.prop == 'updateByName'">
              {{ row.updateByName }}
            </span>
            <!-- 创建时间 -->
            <span v-else-if="item.prop == 'createDate'"
              >{{ row.createDate }}
            </span>
            <!-- 更新时间 -->
            <span v-else-if="item.prop == 'updateDate'"
              >{{ row.updateDate }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              icon="el-icon-edit-outline"
              @click="addOrUpdate(row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              @click="deleteProblem(row)"
              >删除</el-button
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
      
      <!-- 新增/编辑 -->
      <add-or-update ref="addOrUpdate" @refreshData="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import ComModule from "@/mixins/common-module";
import AddOrUpdate from "./problem-add-or-update.vue"
export default {
  mixins: [mixinTableModule, ComModule],
  components: {
    AddOrUpdate
  },
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/sysFrequentlyQuestionsDetails/page", // 数据列表接口，API地址
        exportURL: "/sys/sysFrequentlyQuestionsDetails/export", // 导出接口，API地址
      },
      dataForm: {
        title: "",
      },
      params: {
        questionsId: "",
      },
      tableItem: [
        { prop: "num", label: "序号" },
        { prop: "title", label: "问题标题" },
        { prop: "updateByName", label: "更新人" },
        { prop: "updateDate", label: "更新时间" },
        { prop: "createDate", label: "创建时间" },
      ],
      problem: {
        name: "",
        desc: "",
      },
      ids: [],
      dataListSelections: [],
      sortVal: "",
      sortId: "",
      classify:""
    };
  },
  activated() {
    this.classify = this.$route.query.classify
    this.params.questionsId = this.$route.query.questionsId
    this.query();
  },
  watch: {},
  methods: {
    //排序
    dblclick(row, column, cell, event) {
      if (column.property === "num") {
        this.sortId = row.id;
        this.sortVal = row.num;
        this.$nextTick(() => {
          let id = "#" + "input" + this.sortId;
          document.querySelector(id).focus();
        });
      }
    },
    //回车确认
    userSelect() {
      this.$http
        .put("/sys/sysFrequentlyQuestionsDetails", {
          num: this.sortVal,
          id: this.sortId,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.sortId = "";
            this.sortVal = "";
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },

    // 编辑或新增
    addOrUpdate(row) {
      this.$refs.addOrUpdate.init(row, this.params.questionsId)
    },
    //删除
    deleteProblem(row) {
      this.$confirm("确认删除该问题？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '删除中...';

            if(row) { //操作删除
              this.ids.push(row.id);
            }else { //批量删除
              this.dataListSelections.forEach((v) => {
                this.ids.push(v.id);
              });
            } 

            this.$http.delete(`/sys/sysFrequentlyQuestionsDetails`, {
              data: this.ids,
            }).then(({ data: res }) => {

              instance.confirmButtonLoading = false;
              done()

              if (res.code !== 0) return this.$message.error(res.msg)
              this.$message.success("删除成功")
              this.ids = [];
              this.query();
            }).catch((err) => {
              instance.confirmButtonLoading = false;
              done()
              this.$message.error(JSON.stringify(err))
            });
          } else {
            instance.confirmButtonLoading = false;
            done();
          }
        }
      }).then(() => {
        
      }).catch(() => this.$message.info("取消删除"))
    },
  },
};
</script>
<style lang="scss" scoped>
.mod-live__goodsList {
  .frontCoverImg {
    width: 60px;
    height: 60px;
  }
}
.ql-snow {
  .ql-editor {
    img {
      max-width: 100px !important;
    }
  }
}
/deep/.el-tooltip {
  .el-input {
    width: 100px;
  }
}
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
/deep/input[type="number"] {
  -moz-appearance: textfield !important;
}
</style>