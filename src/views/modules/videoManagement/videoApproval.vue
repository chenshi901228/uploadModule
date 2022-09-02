
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
          v-show="isOpen || formItemCount >= 1"
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
          v-show="isOpen || formItemCount >= 2"
        >
          <el-input
            size="small"
            style="width: 200px"
            v-model.trim="dataForm.anchorUser"
            placeholder="请输入选择"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="视频显示"
          prop="showMode"
          v-show="isOpen || formItemCount >= 3"
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
          label="审核状态"
          prop="approveStatus"
          v-show="isOpen || formItemCount >= 4"
        >
          <el-select
            clearable
            size="small"
            style="width: 200px"
            v-model="dataForm.approveStatus"
            placeholder="请选择"
          >
            <el-option label="审核中" :value="0"></el-option>
            <el-option label="已通过" :value="1"></el-option>
            <el-option label="已驳回" :value="2"></el-option>
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
            <!-- <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="exportHandle"
              >{{ $t("export") }}</el-button
            > -->
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
            <!-- 显示状态 -->
            <span v-else-if="item.prop == 'showState'">
              {{ row.showState ? "显示" : "隐藏" }}
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
          width="100"
        >
          <template slot-scope="{ row }">
            <el-button
              size="small"
              icon="el-icon-video-camera"
              style="margin-left: 10px"
              type="text"
              @click="viewVideo(row)"
              >查看</el-button
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

  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import { sizeTostr, secondToDate } from "@/utils/index";
export default {
  mixins: [mixinTableModule],
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/livePlayback/page", // 数据列表接口，API地址
        exportURL: "/sys/livePlayback/export", // 导出接口，API地址
      },
      dataForm: {
        liveTheme: "",
        anchorUser: "",
        showMode: null,
        showState: null,
        // approveStatus: 1,
      },

      tableItem: [
        { prop: "frontCoverUrl", label: "视频宣传图" },
        { prop: "liveTheme", label: "视频主题" },
        { prop: "anchorUser", label: "主播" },
        { prop: "anchorTel", label: "手机号码" },
        { prop: "showMode", label: "视频显示" },
        { prop: "longTime", label: "视频时长" },
        { prop: "videoSize", label: "视频大小" },
        { prop: "approveStatus", label: "审核状态" },
        { prop: "remark", label: "备注" },
        { prop: "approveName", label: "审核人" },
        { prop: "updateDate", label: "审核时间" },
        { prop: "createByName", label: "创建人" },
        { prop: "createDate", label: "创建时间" },
      ],
    };
  },
  created() {},
  activated() {
    //平台只看已通过
    // this.dataForm.approveStatus = 1
    this.query();
  },
  methods: {
    //查看视频详情
    viewVideo(row) {
      this.$router.push({
        name: "videoManagement-videoDetailAll",
        query: { videoDetail: row, checkFlag: true },
      });
    },
    // 视频大小转换
    sizeTostr(size) {
      return sizeTostr(size);
    },
    // 视频时长转换
    secondToDate(val) {
      return secondToDate(val)
    }
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