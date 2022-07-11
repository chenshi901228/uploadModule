
<!-- 短视频管理 -->

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__livePlayBack">
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
          label="视频主题"
          prop="liveTheme"
          v-if="isOpen || formItemCount >= 1"
        >
          <el-input
            size="small"
            style="width: 200px"
            v-model.trim="dataForm.liveTheme"
            placeholder="请输入选择"
            clearable
          >
          </el-input>
        </el-form-item>

        <el-form-item
          label="主播"
          prop="anchorUser"
          v-if="isOpen || formItemCount >= 2"
        >
          <el-input
            size="small"
            style="width: 200px"
            v-model.trim="dataForm.anchorUser"
            placeholder="请输入"
            clearable
          >
          </el-input>
        </el-form-item>

        <el-form-item
          label="视频显示"
          prop="showMode"
          v-if="isOpen || formItemCount >= 3"
        >
          <el-select
            clearable
            size="small"
            style="width: 200px"
            v-model="dataForm.showMode"
            placeholder="请选择"
          >
            <el-option label="横屏" :value="1"></el-option>
            <el-option label="竖屏" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="显示状态"
          prop="showState"
          v-if="isOpen || formItemCount >= 4"
        >
          <el-select
            clearable
            size="small"
            style="width: 200px"
            v-model="dataForm.showState"
            placeholder="请选择"
          >
            <el-option label="显示" :value="1"></el-option>
            <el-option label="隐藏" :value="0"></el-option>
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
          <div class="headerTool--handle-btns-left">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="exportHandle"
              >{{ $t("export") }}</el-button
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
        @selection-change="dataListSelectionChangeHandle"
        :height="siteContentViewHeight"
        style="width: 100%"
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
          :width="item.width || 120"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <!-- 封面图 -->
            <div v-if="item.prop == 'frontCoverUrl'">
              <img
                class="frontCoverImg"
                :src="
                  row.frontCoverUrl || require('@/assets/img/default_cover.jpg')
                "
                alt=""
              />
            </div>
            <!-- 视频显示 -->
            <span v-else-if="item.prop == 'showMode'">
              {{ row.showMode ? "横屏" : "竖屏" }}
            </span>
            <!-- 删除状态 -->
            <span v-else-if="item.prop == 'liveState'">
              {{ row.liveState == 0 ? "已删除" : "未删除" }}
            </span>
            <!-- 显示状态 -->
            <span v-else-if="item.prop == 'showState'">
              {{ row.showState ? "显示" : "隐藏" }}
            </span>
            <!-- 备注 -->
            <span v-else-if="item.prop == 'remark'">
              {{ row.remark }}
            </span>
            <!-- 审核状态 -->
            <span v-else-if="item.prop == 'approveStatus'">
              {{
                row.approveStatus === 0
                  ? "审核中"
                  : row.approveStatus === 1
                  ? "已通过"
                  : row.approveStatus === 2
                  ? "已驳回"
                  : "-"
              }}
            </span>
            <!-- 直播间ID -->
            <span
              v-else-if="item.prop == 'livingRoomId'"
              style="color: #409eff; text-decoration: underline"
            >
              {{ row[item.prop] }}
            </span>
            <!-- 视频大小 -->
            <span v-else-if="item.prop == 'videoSize'">
              {{ sizeTostr(row[item.prop]) }}
            </span>
            <!-- 视频时长 -->
            <span v-else-if="item.prop == 'longTime'">
              {{ row[item.prop] ? secondToDate(row[item.prop]) : "-" }}
            </span>
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
          width="200"
        >
          <template slot-scope="{ row }">
            <el-button
              size="small"
              icon="el-icon-download"
              type="text"
              @click="actionHandle('1', row)"
              >下载视频</el-button
            >
            <el-button
              size="small"
              icon="el-icon-chat-dot-square"
              style="margin-left: 10px"
              type="text"
              @click="actionHandle('2', row)"
              >评论详情</el-button
            >
            <el-button
              size="small"
              icon="el-icon-sort"
              style="margin-left: 10px"
              type="text"
              v-if="row.liveState !== 0"
              @click="showOrHide(row)"
              >{{ row.showState ? "隐藏" : "显示" }}</el-button
            >
            <el-button
              size="small"
              icon="el-icon-shopping-cart-2"
              style="margin-left: 10px"
              type="text"
              v-if="row.liveState != 0"
              @click="addProduct(row)"
              >带货商品</el-button
            >
            <el-button
              v-if="row.liveState !== 0"
              size="small"
              icon="el-icon-delete"
              style="margin-left: 10px"
              type="text"
              @click="deleteVideo(row)"
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
    </div>
    <el-dialog title="删除" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="备注" prop="desc">
          <el-input
            size="small"
            type="textarea"
            v-model="ruleForm.desc"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="confirm('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import { sizeTostr, downloadFileUrl, secondToDate } from "@/utils/index";
export default {
  mixins: [mixinTableModule],
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/livePlayback/page", // 数据列表接口，API地址
        exportURL: "/sys/livePlayback/export", // 导出接口，API地址
        createdIsNeed: false,
        activatedIsNeed: false,
      },
      dataForm: {
        liveTheme: "",
        anchorUser: "",
        showMode: null,
        showState: null,
        liveState: null,
        approveStatus: null,
      },

      tableItem: [
        { prop: "frontCoverUrl", label: "视频宣传图" },
        { prop: "liveTheme", label: "视频主题" },
        { prop: "anchorUser", label: "主播" },
        { prop: "anchorTel", label: "手机号码" },
        { prop: "showMode", label: "视频显示" },
        { prop: "longTime", label: "视频时长" },
        { prop: "videoSize", label: "视频大小" },
        { prop: "playbackNum", label: "播放次数" },
        { prop: "commentNum", label: "评论次数" },
        { prop: "giveLikeNum", label: "点赞次数" },
        { prop: "shareNum", label: "分享次数" },
        { prop: "addUserNum", label: "新增用户" },
        { prop: "approveStatus", label: "审核状态" },
        { prop: "showState", label: "显示状态" },
        { prop: "liveState", label: "删除状态" },
        { prop: "remark", label: "备注" },
        { prop: "createByName", label: "创建人" },
        { prop: "createDate", label: "创建时间" },
      ],
      dynamicGroupOptions: [], //投放人群
      getDynamicGroupLoading: false, //下拉框加载数据loading
      dialogFormVisible: false,
      ruleForm: {
        desc: "",
      },
      rules: {
        desc: [{ required: true, message: "请填写备注内容", trigger: "blur" }],
      },
      ids: "",
    };
  },
  created() {},
  activated() {
    this.dataForm.approveStatus = 1;
    this.query();
  },
  methods: {
    //新增视频
    addOrUpdateHandle() {
      this.$router.push({
        name: "videoManagement-addVideo",
      });
    },
    //查看视频详情
    viewVideo(row) {
      this.$router.push({
        name: "videoManagement-videoDetailAll",
        query: { videoDetail: row },
      });
    },
    // //删除视频
    deleteVideo(row) {
      this.dialogFormVisible = true;
      this.ids = row.id;
    },
    //删除
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let deleteURL = "";
          deleteURL = "/sys/livePlayback/delete";
          this.$http
            .delete(deleteURL, {
              data: { id: this.ids, remark: this.ruleForm.desc },
            })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                this.ids = "";
                this.ruleForm.desc = "";
                return this.$message.error(res.msg);
              }
              this.ids = "";
              this.ruleForm.desc = "";
              this.query();
              this.$message.success("删除成功!");
              this.dialogFormVisible = false;
            })
            .catch((err) => {
              throw err;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 视频大小转换
    sizeTostr(size) {
      return sizeTostr(size);
    },
    // 视频时长转换
    secondToDate(val) {
      return secondToDate(val);
    },
    actionHandle(action, data) {
      switch (action) {
        case "1": // 下载视频
          if (data.relationLiveUrl)
            window.open(downloadFileUrl(data.relationLiveUrl));
          break;
        case "2": // 查看评论详情
          if (data.id)
            this.$router.push({
              name: "liveManagement-livePlayBackComment",
              query: { id: data.id, sys: 1 },
            });
          break;
      }
    },
    // 视频显示/隐藏
    showOrHide(data) {
      this.customConfirm(`确认${data.showState ? "隐藏" : "显示"}？`, (cb) => {
        this.$http
          .put("/sys/livePlayback/showOrHide", {
            id: data.id,
            showState: data.showState ? 0 : 1,
          })
          .then(({ data: res }) => {
            if (res.code == 0) {
              this.$message.success("操作成功");
              this.query();
            } else {
              this.$message.error(res.msg);
            }
            cb();
          })
          .catch((err) => {
            console.log(err);
            cb();
          });
      });
    },
    // 添加商品
    addProduct({ id, anchorUserId }) {
      this.$router.push({
        name: "videoManagement-addProductAll",
        query: { playbackId: id, anchorId: anchorUserId },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mod-live__livePlayBack {
  .frontCoverImg {
    width: 100%;
    height: 60px;
    object-fit: cover;
  }
}
</style>