
<!-- 主播管理-直播列表 -->

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__liveList">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        label-width="100px"
        @keyup.enter.native="getDataList"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="直播主题" prop="liveTheme">
              <el-input
                size="small"
                v-model.trim="dataForm.liveTheme"
                placeholder="请输入选择"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开播时间" prop="startDate">
              <el-date-picker
                size="small"
                v-model="dataForm.startDate"
                type="datetime"
                style="width:194px"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="请选择开播时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间" prop="endDate">
              <el-date-picker
                size="small"
                v-model="dataForm.endDate"
                type="datetime"
                 style="width:194px"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="请选择结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <div v-if="isOpen">
            <el-row>
              <el-col :span="8">
                <el-form-item label="投放人群" prop="dynamicGroupName">
                  <el-select
                    size="small"
                    v-model="dataForm.dynamicGroupName"
                    placeholder="请选择投放人群"
                    :loading="getDynamicGroupLoading"
                    @visible-change="getDynamicGroup"
                    clearable
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
              </el-col>
              <el-col :span="8">
                <el-form-item label="关联直播" prop="livingRoomId">
                  <el-input
                    size="small"
                    v-model.trim="dataForm.livingRoomId"
                    placeholder="请输入关联直播"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否录制" prop="transcribeFlg">
                  <el-select
                    clearable
                    size="small"
                    v-model="dataForm.transcribeFlg"
                    placeholder="请选择"
                  >
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="直播状态" prop="liveState">
                  <el-select
                    clearable
                    size="small"
                    v-model="dataForm.liveState"
                    placeholder="请选择"
                  >
                    <el-option label="直播中" :value="1"></el-option>
                    <el-option label="已下播" :value="0"></el-option>
                    <el-option label="已禁播" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="显示状态" prop="showState">
                  <el-select
                    clearable
                    size="small"
                    v-model="dataForm.showState"
                    placeholder="请选择"
                  >
                    <el-option label="显示" :value="1"></el-option>
                    <el-option label="隐藏" :value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-col :span="24">
            <el-form-item style="float: right; padding-right: 10px">
              <el-button size="small" type="primary" @click="newLive"
                >创建直播</el-button
              >
              <el-button size="small" type="info" @click="exportHandle">{{
                $t("export")
              }}</el-button>
              <el-button size="small" type="primary" @click="getDataList">{{
                $t("query")
              }}</el-button>
              <el-button size="small" @click="resetDataForm()">{{
                $t("reset")
              }}</el-button>
              <el-button size="small" type="primary" @click="open">
                {{ isOpen ? "收起" : "展开"
                }}<i
                  style="margin-left: 10px"
                  :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                ></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
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
                  row.frontCoverUrl || 'https://picsum.photos/400/300?random=1'
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
          <template slot-scope="{ row }">
            <el-popconfirm
              title="确认下播？"
              v-if="row.liveState == 1"
              @confirm="closeLiveHandle(row.id)"
            >
              <el-button slot="reference" type="text" size="small"
                >下播</el-button
              >
            </el-popconfirm>
            <el-button
              v-if="row.liveState == 1"
              type="text"
              size="small"
              @click="joinLiveHandle(row.id)"
              >进入直播间</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
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
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
export default {
  mixins: [mixinTableModule],
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/liveList/pageOwn", // 数据列表接口，API地址
        exportURL: "/sys/liveList/export", // 导出接口，API地址
      },
      dataForm: {
        liveTheme: "",
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
        { prop: "liveTheme", label: "直播主题" },
        { prop: "liveBroadcastWay", label: "推流端" },
        { prop: "showMode", label: "显示方式" },
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
          .get("/sys/dynamicGroup/getDynamicGroupList")
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
    // 创建直播
    newLive() {
      this.$prompt("直播主题", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: (value) => {
          if (!value) return "请输入直播主题";
        },
      })
        .then(({ value }) => {
          console.log(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    // 下播
    closeLiveHandle(id) {
      if (!id) return;
    },
    // 进入直播间
    joinLiveHandle(id) {},
  },
};
</script>
<style lang="scss" scoped>
.mod-live__liveList {
  .frontCoverImg {
    width: 100%;
    height: 60px;
  }
}
</style>