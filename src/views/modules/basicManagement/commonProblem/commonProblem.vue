
<!-- 基础管理-常见问题 -->

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
          label="问题分类"
          prop="classify"
        >
          <el-select
            style="width: 200px"
            clearable
            v-model="dataForm.classify"
            placeholder="请选择"
          >
            <el-option
              v-for="item in allProblem"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
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
                @click="deleteProblem"
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
            <!-- 分类图标 -->
            <div v-else-if="item.prop == 'pictureUrl'">
              <img
                class="frontCoverImg"
                :src="
                  row.pictureUrl || 'https://picsum.photos/400/300?random=1'
                "
                alt=""
              />
            </div>
            <!-- 问题分类 -->
            <span v-else-if="item.prop == 'classify'">
              {{ row.classify }}
            </span>
            <!-- 创建时间 -->
            <span v-else-if="item.prop == 'createDate'"
              >{{ row.createDate }}
            </span>
            <!-- 标签 -->
            <!-- <span v-else-if="item.prop == 'isFree'">
              <el-tag size="small" :type="row.isFree ? 'success' : 'danger'">{{
                row.isFree ? "是" : "否"
              }}</el-tag>
            </span> -->
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
              icon="el-icon-c-scale-to-original"
              @click="toProblemList(row)"
              >问题列表</el-button
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


      <!-- 新增/更新问题分类 -->
      <add-or-update ref="addOrUpdate" @refreshData="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import AddOrUpdate from "./problem-add-or-update.vue"

export default {
  mixins: [mixinTableModule],
  components: {
    AddOrUpdate
  },
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/sysFrequentlyQuestions/page", // 数据列表接口，API地址
        exportURL: "/sys/sysFrequentlyQuestions/export", // 导出接口，API地址
      },
      dataForm: {
        classify: "",
      },
      tableItem: [
        { prop: "num", label: "序号" },
        { prop: "pictureUrl", label: "分类图标" },
        { prop: "classify", label: "问题分类" },
        { prop: "createDate", label: "创建时间" },
      ],
      allProblem: [],
      ids: [],
      dialogVisible: false,
      dataListSelections: [],
      sortVal: "",
      sortId: "",
    };
  },
  activated() {
    this.query();
    this.getAllProblem();
  },
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
        .put("/sys/sysFrequentlyQuestions", {
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
    //问题列表
    toProblemList(row) {
      this.$router.push({
        name: "basicManagement-commonProblem-problemList",
        query: {
          questionsId: row.id,
          classify:row.classify
        },
      });
    },
    //获取所有问题分类
    getAllProblem() {
      this.$http
        .get("/sys/sysFrequentlyQuestions/getClassify")
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.allProblem = res.data;
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //批量删除
    deleteProblem(row) {
      this.$confirm("该分类的问题列表也会删除，确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: 'warning'
      }).then(() => {
        if(row) { //操作删除
          this.ids.push(row.id);
        }else { //批量删除
          this.dataListSelections.forEach((v) => {
            this.ids.push(v.id);
          });
        } 
        this.$http.delete(`/sys/sysFrequentlyQuestions`, {
          data: this.ids,
        }).then(({ data: res }) => {
          if (res.code !== 0) return this.$message.error(res.msg)
          this.ids = [];
          this.query();
        }).catch((err) => {
          throw err;
        });
      }).catch(() => this.$message.info("取消删除"))
    },
    // 新增/编辑
    addOrUpdate(row) {
      this.$refs.addOrUpdate.init(row)
    }
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
/deep/.hide_box .el-upload--picture-card {
  display: none;
}
</style>