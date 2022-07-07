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
          v-if="(isOpen || formItemCount >= 3) && authEdit == 1"
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
          <div class="headerTool--handle-btns-left">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              v-if="authEdit == 1"
              :disabled="dataListSelections.length === 0"
              @click="addSelect()"
              >批量添加</el-button
            >
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
        @selection-change="dataListSelectionChangeHandle"
        style="width: 100%"
        ref="table"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
          fixed="left"
        ></el-table-column>
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
                style="width: 80px; height: 80px"
                class="frontCoverImg"
                :src="row.avatarUrl || require('@/assets/img/default_avatar.png')"
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
          v-if="authEdit == 1"
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
          v-if="authEdit == 1"
        >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-delete"
              type="text"
              size="small"
              @click="deleteSelect(scope.row)"
              v-if="scope.row.state === '1'"
              >删除</el-button
            >
            <el-button
              icon="el-icon-plus"
              type="text"
              size="small"
              @click="addAnchor(scope.row)"
              v-if="scope.row.state === '0'"
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
    <el-dialog title="批量添加" :visible.sync="dialogAddVisible" width="30%">
      <span>确定定批量添加推荐主播?</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogAddVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="confirmAddSelect"
          >确 定</el-button
        >
      </span>
    </el-dialog>

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
      <span>置顶该主播后，将展示在第一个，确认置顶</span>
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
        createdIsNeed: false,
        activatedIsNeed: false,
      },
      dataForm: {
        username: "",
        phone: "",
      },
      params: {
        state: "",
        liveId: "",
        anchorId: "",
      },
      dialogVisible: false,
      dialogDeleteVisible: false,
      id: "",
      ids: [],
      dialogAddVisible: false,
      selectAddList: [],
      authEdit: 1, //从直播列表进来是否有编辑权限：1-有，0-没有
    };
  },
  activated() {
    if(this.$route.query.authEdit != undefined) { //有表示来自直播列表
      this.authEdit = this.$route.query.authEdit
      if(this.authEdit == 0) this.params.state = 1  //直播列表已下播或已禁播增加查询参数state
    }else { //来自预告
      this.authEdit = 1
    }
    this.params.liveId = this.$route.query.liveId;
    this.params.anchorId = this.$route.query.anchorId;
    this.query();
  },
  methods: {
    //确认批量添加
    confirmAddSelect() {
      this.$http
        .post("/sys/sysRecommendedAnchor", this.selectAddList)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.dialogAddVisible = false;
            this.selectAddList = [];
            return this.$message.error(res.msg);
          } else {
            this.selectAddList = [];
            this.dialogAddVisible = false;
            this.$message.success("添加成功！");
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //批量添加
    addSelect() {
      let flag = this.dataListSelections.some((val) => {
        return val.state === '1';
      });
      if (flag) {
        this.$message.warning("请选择未添加主播！");
      } else {
        this.dialogAddVisible = true;
        this.dataListSelections.forEach((v) => {
          this.selectAddList.push({
            liveId: this.params.liveId,
            anchorId: v.anchorId,
          });
        });
      }
    },
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
      let list = [];
      list.push({
        liveId: this.params.liveId,
        anchorId: row.anchorId,
      });
      this.$http
        .post("/sys/sysRecommendedAnchor", list)
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
          this.ids = [];
          this.dialogDeleteVisible = false;
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.$message.success("删除成功！");
            this.query();
          }
        })
        .catch((err) => {
          this.ids = [];
          this.dialogDeleteVisible = false;
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
      };
      this.query();
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