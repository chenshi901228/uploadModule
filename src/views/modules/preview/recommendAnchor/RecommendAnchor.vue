// 推荐主播
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
          label="主播昵称"
          prop="level"
          v-if="isOpen || formItemCount >= 1"
        >
          <el-input
            placeholder="请输入"
            style="width: 200px"
            clearable
            v-model="dataForm.username"
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
            v-model="dataForm.phone"
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
            v-model="dataForm.state"
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
            <el-button icon="el-icon-refresh" size="mini" @click="resetDataForm"
              >重置</el-button
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
        :height="siteContentViewHeight"
        style="width: 100%"
        ref="table"
      >
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column
          prop="level"
          label="主播头像"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              <img
                style="width: 80px; height: '80px'"
                class="frontCoverImg"
                :src="row.avatarUrl || 'https://picsum.photos/400/300?random=1'"
                alt=""
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="主播昵称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="updateDate"
          label="推荐时间"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="state"
          label="添加状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.state === "0" ? "未添加" : "已添加" }}
          </template></el-table-column
        >
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
              icon="el-icon-delete"
              type="text"
              size="small"
              @click="addAnchor(scope.row)"
              >添加</el-button
            >
            <el-button
              v-if="scope.row.state === '1'"
              icon="el-icon-upload2"
              type="text"
              size="small"
              @click="toTop(scope.row)"
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
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getDataList"
      ></add-or-update>
    </div>

    <el-dialog title="提醒" :visible.sync="dialogDeleteVisible" width="30%">
      <span>确定删除该主播推荐</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDeleteVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="confirmDelete"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="置顶" :visible.sync="dialogVisible" width="30%">
      <span>置顶该商品后，将展示在第一个，确认置顶</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmCargo"
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
        getDataListURL: "/sys/sysRecommendedAnchor/page",
        getDataListIsPage: true,
        exportURL: "/sys/sysfanslevel/export",
        deleteURL: "/sys/sysfanslevel",
        deleteIsBatch: true,
      },
      dataForm: {
        liveId: this.$route.query.liveId,
      },
      loading: false, //礼物输入下拉选择loading
      giftOptions: [], //礼物下拉选择内容
      fansLevelsOptions: [], //粉丝等级options
      dialogVisible: false,
      dialogDeleteVisible: false,
      id: "",
      ids: [],
    };
  },
  watch: {},
  components: {},
  methods: {
    //批量添加
    addProduct() {},
    //删除
    deleteSelect(row) {
      this.ids.push(row.id);
      this.dialogDeleteVisible = true;
    },
    //置顶
    toTop(row) {
      this.id = row.id;
      this.dialogVisible = true;
    },
    //添加主播
    addAnchor(row) {
      this.$http
        .post("/sys/sysRecommendedAnchor", {
          liveId: this.$route.query.liveId,
          anchorId: row.anchorId,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.$message.success("添加成功！");
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //确认删除
    confirmDelete() {
      this.$http
        .delete(`/sys/sysRecommendedAnchor`, {
          data: this.ids,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.ids = [];
            this.dialogDeleteVisible = false;
            this.$message.success("删除成功！");
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //确认置顶
    confirmCargo() {
      this.$http
        .put("/sys/sysRecommendedAnchor", {
          id: this.id,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.$message.success("置顶成功！");
            this.dialogVisible = false;
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //重置
    resetDataForm() {
      this.dataForm = {
        username: "",
        phone: "",
        state: "",
        liveId: this.$route.query.liveId,
      };
      this.query()
    },
  },
};
</script>
<style scoped lang="scss">
.mod-live__liveList {
  .frontCoverImg {
    width: 100%;
    height: 80px;
  }
}
</style>