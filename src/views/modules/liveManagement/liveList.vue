
<!-- 直播管理-直播列表 -->

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__liveList">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        label-width="100px"
        @keyup.enter.native="getDataList">
          <el-form-item v-if="isOpen || formItemCount >= 1" label="是否录制" prop="transcribeFlg">
            <el-select
              clearable
              v-model="dataForm.transcribeFlg"
              placeholder="请选择"
              style="width: 200px"
            >
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isOpen || formItemCount >= 2" label="直播间ID" prop="livingRoomId">
            <el-input
              v-model.trim="dataForm.livingRoomId"
              placeholder="请输入直播间ID"
              clearable
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-if="isOpen || formItemCount >= 3" label="直播状态" prop="liveState">
            <el-select
              clearable
              v-model="dataForm.liveState"
              placeholder="请选择"
              style="width: 200px"
            >
              <el-option label="直播中" :value="1"></el-option>
              <el-option label="已下播" :value="0"></el-option>
              <el-option label="已禁播" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isOpen || formItemCount >= 4" label="显示状态" prop="showState">
            <el-select
              clearable
              v-model="dataForm.showState"
              placeholder="请选择"
              style="width: 200px"
            >
              <el-option label="显示" :value="1"></el-option>
              <el-option label="隐藏" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isOpen || formItemCount >= 5" label="直播主题" prop="liveTheme">
            <el-input

              v-model.trim="dataForm.liveTheme"
              placeholder="请输入选择"
              clearable
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-if="isOpen || formItemCount >= 6" label="主播" prop="anchorUser">
            <el-input

              v-model.trim="dataForm.anchorUser"
              placeholder="请输入姓名或手机号码"
              clearable
              style="width: 200px"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-if="isOpen || formItemCount >= 7" label="结束时间" prop="endDate">
            <el-date-picker

              v-model="dataForm.endDate"
              type="datetime"
              style="width: 200px"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="请选择结束时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="isOpen || formItemCount >= 8" label="投放人群" prop="dynamicGroupName">
            <el-select

              v-model="dataForm.dynamicGroupName"
              placeholder="请选择投放人群"
              :loading="getDynamicGroupLoading"
              @visible-change="getDynamicGroup"
              clearable
              style="width: 200px"
            >
              <el-option
                v-for="item in dynamicGroupOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 搜索重置展开按钮 -->
          <div class="headerTool-search-btns">
            <el-form-item>
              <el-button 
                type="primary" 
                icon="el-icon-search" 
                size="mini"
                @click="getDataList">{{ $t("query") }}</el-button>
              <el-button 
                icon="el-icon-refresh" 
                size="mini" 
                @click="resetDataForm()">{{ $t("reset") }}</el-button>
              <el-button size="mini" plain @click="open">
                <i :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                {{ isOpen ? "收起" : "展开" }}
              </el-button>
            </el-form-item>
          </div>
          <!-- 操作按钮 -->
          <div class="headerTool-handle-btns">
            <div class="headerTool--handle-btns-left">
              <el-form-item>
                <el-button 
                  type="warning"
                  plain
                  icon="el-icon-download" 
                  size="mini"
                  @click="exportHandle">{{ $t("export") }}</el-button>
              </el-form-item>
            </div>
            <div class="headerTool--handle-btns-right">
              <el-form-item>
                <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                  <el-button size="small" icon="el-icon-refresh" circle @click="getDataList"></el-button>
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
          :sortable="
            ['transcribeFlg', 'liveState', 'showState'].includes(item.prop)
          "
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
            <!-- 显示方式 -->
            <span v-else-if="item.prop == 'showMode'">
              {{ row.showMode ? "横屏" : "竖屏" }}
            </span>
            <!-- 是否录制 -->
            <span v-else-if="item.prop == 'transcribeFlg'">
              {{ row.transcribeFlg ? "是" : "否" }}
            </span>
            <!-- 直播状态 -->
            <span v-else-if="item.prop == 'liveState'">
              {{
                row.liveState == 1
                  ? "直播中"
                  : row.liveState == 0
                  ? "已下播"
                  :row.liveState == 3
                  ? "未开播"
                  : "已禁播"
              }}
            </span>
            <!-- 显示状态 -->
            <span v-else-if="item.prop == 'showState'">
              {{ row.showState ? "显示" : "隐藏" }}
            </span>
            <!-- 直播间ID -->
            <span
              v-else-if="item.prop == 'livingRoomId'"
              style="color: #409eff; text-decoration: underline"
            >
              {{ row[item.prop] }}
            </span>
            <!-- 直播时长 -->
            <span v-else-if="item.prop == 'liveTime'">
              {{ row.liveTime ? row.liveTime + "分钟" : "-" }}
            </span>
            <!-- 投放人群 -->
            <span v-else-if="item.prop == 'dynamicGroupName'">
              {{ row.dynamicGroupName || "-" }}
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
              type="text"
              size="small"
              icon="el-icon-circle-close"
              v-if="row.liveState == 1"
              @click="banLiveHandle(row.id)"
              >禁播</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-goods"
              @click="addProduct(row)"
              >带货商品</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-user"
              @click="addAnchor(row)"
              >推荐主播</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-user-solid"
              @click="assistant(row)"
              >助手</el-button
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

      <!-- 禁播备注弹框 -->
      <remark-modal
        ref="remarkModal"
        @confirm="banLiveConfirm"
        title="禁播"
      ></remark-modal>
    </div>
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import RemarkModal from "@/components/common/remarkDialog";
export default {
  mixins: [mixinTableModule],
  components: {
    RemarkModal,
  },
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/liveList/page", // 数据列表接口，API地址
        exportURL: "/sys/liveList/export", // 导出接口，API地址
      },
      dataForm: {
        liveTheme: "",
        anchorUser: "",
        startDate: "",
        endDate: "",
        livingRoomId: "",
        dynamicGroupName: "",
        transcribeFlg: null,
        liveState: null,
        showState: null,
      },

      tableItem: [
        { prop: "frontCoverUrl", label: "封面图" },
        { prop: "liveBroadcastWay", label: "推流端" },
        { prop: "showMode", label: "显示方式" },
        { prop: "liveTheme", label: "直播主题" },
        { prop: "anchorUser", label: "主播" },
        { prop: "anchorTel", label: "手机号码" },
        { prop: "startDate", label: "开播时间", width: 180 },
        { prop: "endDate", label: "结束时间", width: 180 },
        { prop: "liveTime", label: "直播时长（分）" },
        { prop: "dynamicGroupName", label: "投放人群" },
        { prop: "audienceNum", label: "观众总数" },
        { prop: "maxOnlineNum", label: "最高同时在线" },
        { prop: "giveLikeNum", label: "点赞次数" },
        { prop: "interactionNum", label: "互动次数" },
        { prop: "shareNum", label: "分享次数" },
        { prop: "addUserNum", label: "新增用户" },
        { prop: "transcribeFlg", label: "是否录制" },
        { prop: "liveState", label: "直播状态" },
        { prop: "showState", label: "显示状态" },
        { prop: "livingRoomId", label: "直播间ID", width: 180 },
        { prop: "remark", label: "备注" },
        { prop: "createDate", label: "创建时间", width: 180 },
      ],
      dynamicGroupOptions: [], //投放人群
      getDynamicGroupLoading: false, //下拉框加载数据loading
    };
  },
  created() {
    // this.query()
  },
  activated() {
    this.query();
  },
  methods: {
    // 投放人群下拉请求数据
    getDynamicGroup(value) {
      if (value) {
        //展开下拉框 请求数据
        this.getDynamicGroupLoading = true;
        this.$http
          .get("/sys/dynamicGroup/getAllDynamicGroupList")
          .then(({ data: res }) => {
            if (res.code == 0) {
              this.dynamicGroupOptions = res.data;
            } else {
              this.$message.error(res.msg);
              this.dynamicGroupOptions = [];
              this.dataForm.dynamicGroupName = "";
            }
            this.getDynamicGroupLoading = false;
          })
          .catch((err) => {
            this.getDynamicGroupLoading = false;
            this.dynamicGroupOptions = [];
            this.dataForm.dynamicGroupName = "";
          });
      }
    },
    // 禁播
    banLiveHandle(id) {
      if (!id) return;
      this.$refs.remarkModal.init(id);
    },
    // 确认禁播
    banLiveConfirm(remark, id, cb) {
      this.$http
        .put("/sys/liveList/stopLive", { id, remark })
        .then(({ data: res }) => {
          cb();
          if (res.code == 0) {
            this.$message.success("禁播成功");
            this.$refs.remarkModal.close();
            this.query();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          cb();
          this.$refs.remarkModal.close();
          throw err;
        });
    },
    //带货商品
    addProduct(row) {
      this.$router.push({
        path: "/preview-cargoGoods-CargoGoods",
      });
    },
    //推荐主播
    addAnchor(row) {
      this.$router.push({
        path: "/preview-recommendAnchor-RecommendAnchor",
      });
    },
    //助手
    assistant(row) {
      this.$router.push({
        path: "/preview-assistant-Assistant",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mod-live__liveList {
  .frontCoverImg {
    width: 100%;
    height: 60px;
    object-fit: cover;
  }
}
</style>