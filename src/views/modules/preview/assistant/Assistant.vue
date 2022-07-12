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
          prop="username"
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
          prop="phone"
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
          prop="isAdd"
          v-if="(isOpen || formItemCount >= 3) && authEdit == 1"
        >
          <el-select
            placeholder="请选择"
            style="width: 200px"
            v-model="dataForm.isAdd"
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
        :height="siteContentViewHeight"
        style="width: 100%"
        ref="table"
      >
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="助手昵称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="updateDate"
          label="更新时间"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isAdd"
          label="添加状态"
          header-align="center"
          align="center"
          v-if="authEdit == 1"
        >
          <template slot-scope="scope">
            {{ scope.row.isAdd === 1 ? "已添加" : "未添加" }}
          </template>
        </el-table-column>
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
              v-if="scope.row.isAdd === 1"
              icon="el-icon-delete"
              type="text"
              size="small"
              @click="deleteSelect(scope.row)"
              >删除</el-button
            >
            <el-button
              v-if="scope.row.isAdd === 0"
              icon="el-icon-upload2"
              type="text"
              size="small"
              @click="add(scope.row)"
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
      <span>确定删除该助手</span>
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
        getDataListURL: "/sys/anchorAssistant/live/anchorAssistantWithLivePage",
        getDataListIsPage: true,
        deleteIsBatch: true,
        createdIsNeed: false,
        activatedIsNeed: false,
      },
      dataForm: {
        type: 2,
        anchorId: "",
        liveId: "",
      },
      loading: false, //礼物输入下拉选择loading
      giftOptions: [], //礼物下拉选择内容
      fansLevelsOptions: [], //粉丝等级options
      dialogVisible: false,
      ids: [],
      authEdit: 1, //从直播列表进来是否有编辑权限：1-有，0-没有
    };
  },
  activated() {
    if(this.$route.query.authEdit != undefined) { //有表示来自直播列表
      this.authEdit = this.$route.query.authEdit
    }else { //来自预告
      this.authEdit = 1
    }
    this.dataForm.liveId = this.$route.query.liveId;
    this.dataForm.type = parseInt(this.$route.query.type)
    this.dataForm.anchorId = this.$route.query.anchorId;
    this.query();
  },
  methods: {
    //删除
    deleteSelect(row) {
      this.ids.push(row.assistantLiveId);
      this.dialogVisible = true;
    },
    //确认删除
    confirmDelete() {
      this.$http
        .delete(`/sys/anchorAssistant/live/deleteWithLive`, {
          data: {
            ids: this.ids,
            liveId: this.dataForm.liveId,
            type: this.dataForm.type,
          },
        })
        .then(({ data: res }) => {
          this.ids = [];
          this.dialogDeleteVisible = false;
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.dialogVisible = false;
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
    //添加
    add(row) {
      this.$http
        .post("/sys/anchorAssistant/live", {
          liveId: this.dataForm.liveId,
          anchorId: this.dataForm.anchorId,
          weixinUserId: row.weixinUserId,
          type: this.dataForm.type,
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
    //重置
    resetDataForm() {
      this.dataForm = {
        username: "",
        phone: "",
        isAdd: "",
        liveId: this.$route.query.liveId,
        type: this.dataForm.type,
        anchorId: this.$route.query.anchorId,
      };

      this.query();
    },
  },
};
</script>
