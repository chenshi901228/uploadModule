<!-- 主播选择 -->
<template>
  <el-dialog
    title="推荐主播"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
    :close-on-press-escape="false"
    width="80%"
    top="20px"
  >
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList"
      size="small"
      ref="dataForm"
      label-width="100px"
    >
      <el-form-item label="主播昵称" prop="username">
        <el-input
          style="width: 200px"
          v-model="dataForm.username"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          style="width: 200px"
          v-model="dataForm.phone"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="getDataList"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="reset"
          >重置</el-button
        >
      </el-form-item>

      <!-- 操作按钮 -->
      <div class="headerTool-handle-btns">
        <div class="headerTool--handle-btns-left">
          <!-- <el-form-item>
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-plus"
                            size="mini"
                            :disabled="!dataListSelections.length"
                            @click="add()">批量添加</el-button>
                    </el-form-item> -->
        </div>
      </div>
    </el-form>
    <!-- 选中的内容 -->
    <div class="selectedData">
      <el-tooltip
        v-for="item in defaultSelected"
        :key="item.anchorId"
        :content="item.username"
        placement="top"
      >
        <span class="showTitle"
          >{{ item.username
          }}<i @click="deleteSelect(item)" class="el-icon-close"></i
        ></span>
      </el-tooltip>
    </div>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      ref="table"
      @select="selectRow"
      @select-all="selectAll"
      height="360px"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
        fixed="left"
      >
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        v-for="item in tableItem"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <!-- 封面图 -->
          <div v-if="item.prop == 'avatarUrl'">
            <img
              class="avatarImg"
              :src="row.avatarUrl || require('@/assets/img/default_cover.jpg')"
              alt=""
            />
          </div>
          <span v-else-if="item.prop == 'delFlg'">{{
            row.delFlg === 0 ? "上架" : "下架"
          }}</span>
          <span v-else>
            {{ row[item.prop] || "-" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('handle')"
        fixed="right"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            icon="el-icon-upload2"
            type="text"
            size="small"
            @click="confirmCargo(scope.row)"
            >置顶</el-button
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
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="add()" size="small">确 认</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      dataForm: {
        // 查询条件
        username: "",
        phone: "",
      },
      dataList: [], // 数据列表
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataListLoading: false, // 数据列表，loading状态
      dataListSelections: [], // 数据列表，多选项
      defaultSelected: [], //默认选中的数据
      tableItem: [
        { prop: "avatarUrl", label: "主播头像" },
        { prop: "username", label: "主播昵称" },
        { prop: "phone", label: "手机号码" },
        { prop: "updateDate", label: "更新时间" },
      ],
    };
  },
  methods: {
    //确认置顶
    confirmCargo(row) {
      this.$http
        .put("/sys/sysRecommendedAnchor", {
          id: row.id,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.$message.success("置顶成功！");
            this.dialogTopVisible = false;
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    init(data) {
      this.defaultSelected = data || [];
      this.page = 1;
      this.limit = 10;
      this.dialogVisible = true;
      this.query();
    },
    // 设置默认选中的行
    setCurPageSelected() {
      this.$nextTick(() => {
        if (this.defaultSelected.length) {
          this.dataList.map((row, i) => {
            this.defaultSelected.map((item) => {
              if (row.anchorId == item.anchorId) {
                this.$refs.table.toggleRowSelection(row, true);
              }
            });
          });
        } else {
          this.$refs.table.clearSelection();
        }
      });

      // 防止table刷新错位
      if (this.$refs.table) {
        this.$nextTick(() => {
          this.$refs.table.doLayout();
        });
      }
    },
    // 获取数据列表
    query() {
      this.dataListLoading = true;
      this.$http
        .get("/sys/sysRecommendedAnchor/pageForAddLivePreview", {
          params: {
            page: this.page,
            limit: this.limit,
            ...this.$httpParams(this.dataForm),
          },
        })
        .then(({ data: res }) => {
          this.dataListLoading = false;
          if (res.code !== 0) {
            this.dataList = [];
            this.total = 0;
            return this.$message.error(res.msg);
          }
          this.dataList = res.data.list;
          this.total = res.data.total;

          this.setCurPageSelected();
        })
        .catch((err) => {
          this.dataListLoading = false;
          this.$message.error(JSON.stringify(err.message));
        });
    },
    // 选择添加
    add(row) {
      this.$emit("add", this.defaultSelected);
    },
    // 点击删除
    deleteSelect(data) {
      this.$confirm("确认取消推荐主播", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 取消选中行
          this.dataList.forEach((row) => {
            if (row.anchorId == data.anchorId) {
              this.$refs.table.toggleRowSelection(row, false);
            }
          });
          // 默认选中数据中去掉这条数据
          this.defaultSelected = this.defaultSelected.filter(
            (item) => item.anchorId != data.anchorId
          );
        })
        .catch(() => this.$message.info("取消操作"));
    },
    // 手动选中行变化
    selectRow(selection, row) {
      // 判断是选中还是取消选中
      let isSelected =
        selection.filter((item) => item.anchorId == row.anchorId).length == 1;
      if (isSelected) {
        //选中-添加数据
        this.defaultSelected.push(row);
      } else {
        //删除数据
        this.defaultSelected = this.defaultSelected.filter(
          (item) => item.anchorId != row.anchorId
        );
      }
    },
    // 手动勾选全选
    selectAll(selection) {
      if (selection.length) {
        //全部选中
        if (!this.defaultSelected.length) {
          this.defaultSelected = selection;
        } else {
          // 创建临时变量
          let data = JSON.parse(JSON.stringify(selection));
          let arr = [...this.defaultSelected, ...data];

          // 全选时，合并数据去重
          for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
              if (arr[i].anchorId == arr[j].anchorId) {
                arr.splice(i, 1);
                j--;
              }
            }
          }

          this.defaultSelected = arr;
        }
      } else {
        //全部取消
        // 创建临时变量
        let data = JSON.parse(JSON.stringify(this.defaultSelected));

        this.dataList.map((item) => {
          data.map((val, index) => {
            if (item.anchorId == val.anchorId) {
              data.splice(index, 1);
            }
          });
        });

        this.defaultSelected = data;
      }
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.page = 1;
      this.limit = val;
      this.query();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.page = val;
      this.query();
    },
    getDataList: function () {
      this.page = 1;
      this.query();
    },
    // 重置搜索条件
    reset() {
      this.$refs.dataForm.resetFields();
      this.getDataList();
    },

    // 关闭
    close() {
      this.$refs.dataForm.resetFields();
      this.$refs.table.clearSelection();
      this.dataListSelections = [];
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.selectedData {
  display: flex;
  flex-wrap: wrap;
  max-height: 60px;
  overflow-y: auto;
  .showTitle {
    display: inline-block;
    max-width: 150px;
    padding: 0 20px 0 10px;
    line-height: 30px;
    background: #eaf4fc;
    color: #909399;
    border-radius: 6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
    i {
      position: absolute;
      right: 4px;
      top: 4px;
    }
  }
}
.el-dialog__body {
  padding: 10px 20px !important;
}
.avatarImg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
</style>
