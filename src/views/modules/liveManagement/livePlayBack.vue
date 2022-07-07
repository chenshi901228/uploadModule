
<!-- 直播管理-直播回放 -->

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__livePlayBack">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        label-width="100px"
        size="small"
        @keyup.enter.native="getDataList"
      >
        <el-form-item v-if="isOpen || formItemCount >= 1" label="回放主题" prop="liveTheme">
          <el-input
            v-model.trim="dataForm.liveTheme"
            placeholder="请输入选择"
            clearable
            style="width: 200px"
          >
          </el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 2" label="主播" prop="anchorUser">
          <el-input
            v-model.trim="dataForm.anchorUser"
            placeholder="请输入姓名或手机号"
            clearable
            style="width: 200px"
          >
          </el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 3" label="视频显示" prop="showMode">
          <el-select
            clearable
            v-model="dataForm.showMode"
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option label="横屏" :value="1"></el-option>
            <el-option label="竖屏" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 4" label="投放人群" prop="dynamicGroupName">
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
        <el-form-item v-if="isOpen || formItemCount >= 5" label="生成状态" prop="productState">
          <el-select
            clearable
            v-model="dataForm.productState"
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option label="生成中" :value="0"></el-option>
            <el-option label="已生成" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-if="isOpen || formItemCount >= 6" label="显示状态" prop="showState">
          <el-select
            clearable
            v-model="dataForm.showState"
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option label="显示" :value="1"></el-option>
            <el-option label="隐藏" :value="0"></el-option>
          </el-select>
        </el-form-item> -->
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
              <!-- <el-button
                size="mini"
                plain
                icon="el-icon-plus"
                type="primary"
                @click="addOrUpdateHandle()">{{ $t("add") }}</el-button> -->
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
        >
          <template slot-scope="{ row }">
            <!-- 封面图 -->
            <div v-if="item.prop == 'frontCoverUrl'">
              <img
                class="frontCoverImg"
                :src="row.frontCoverUrl || require('@/assets/img/default_cover.jpg')"
                alt=""
              />
            </div>
            <!-- 视频显示 -->
            <span v-else-if="item.prop == 'showMode'">
              {{ row.showMode ? "横屏" : "竖屏" }}
            </span>
            <!-- 回放状态 -->
            <span v-else-if="item.prop == 'productState'">
              {{
                  row.productState == 0
                  ? "生成中"
                  : "已生成"
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
            <!-- 视频大小 -->
            <span v-else-if="item.prop == 'videoSize'">
              {{ row[item.prop]?sizeTostr(row[item.prop]):'-' }}
            </span>
            <!-- 视频时长 -->
            <span v-else-if="item.prop == 'duration'">
              {{ row[item.prop] ? secondToDate(row[item.prop]) : "-" }}
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
              v-if="row.productState==1"
              icon="el-icon-download"
              @click="actionHandle('1',row)"
              >下载视频</el-button
            >
            <el-button
              size="small"
              style="margin-left: 10px"
              type="text"
              v-if="row.productState==1"
              icon="el-icon-view"
              @click="sendPrompt(row.id)"
              >发送回放提醒</el-button
            >
            <!-- <el-button
              size="small"
              style="margin-left: 10px"
              type="text"
              icon="el-icon-document"
              v-if="row.liveState == 1"
              @click="actionHandle('2',row)"
              >评论详情</el-button
            >
            <el-button
              size="small"
              style="margin-left: 10px"
              type="text"
              icon="el-icon-delete"
              v-if="row.liveState != 0"
              @click="actionHandle('3',row)"
              >删除</el-button
            >
          
            <el-button
              size="small"
              style="margin-left: 10px"
              type="text"
              icon="el-icon-view"
              v-if="row.liveState != 0"
              @click="showOrHide(row)"
              >{{ row.showState ? "隐藏" : "显示" }}</el-button
            > -->
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

      <!-- 备注弹框 -->
      <remark-modal
        ref="remarkModal"
        @confirm="confirmHandle"
        title="删除"
      ></remark-modal>

      <!-- 新增 -->
      <add-or-update
        ref="addOrUpdate"
        @refreshDataList="getDataList"
      ></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
import { sizeTostr, downloadFileUrl, secondToDate } from "@/utils/index";
import RemarkModal from "@/components/common/remarkDialog";
import AddOrUpdate from "./livePlayBack-add-or-update.vue";
export default {
  mixins: [mixinTableModule],
  components: {
    RemarkModal,
    AddOrUpdate,
  },
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/liveplaybacknew/page", // 数据列表接口，API地址
        exportURL: "/sys/liveplaybacknew/export", // 导出接口，API地址
      },
      dataForm: {
        liveTheme: "",
        anchorUser: "",
        showMode: null,
        showState: null,
        productState: null,
        dynamicGroupName: "",
      },

      tableItem: [
        { prop: "frontCoverUrl", label: "直播宣传图" },
        { prop: "liveTheme", label: "回放主题" },
        { prop: "anchorUser", label: "主播" },
        { prop: "anchorTel", label: "手机号码" },
        { prop: "showMode", label: "视频显示" },
        { prop: "duration", label: "视频时长" },
        { prop: "videoSize", label: "视频大小" },
        { prop: "dynamicGroupName", label: "投放人群" },
        { prop: "productState", label: "生成状态" },
        { prop: "showState", label: "显示状态" },
        { prop: "livingRoomId", label: "直播间ID", width: 180 },
        { prop: "createDate", label: "创建时间", width: 180 },
        // { prop: "playbackNum", label: "回放次数" },
        // { prop: "commentNum", label: "评论次数" },
        // { prop: "giveLikeNum", label: "点赞次数" },
        // { prop: "shareNum", label: "分享次数" },
        // { prop: "addUserNum", label: "新增用户" },
        // { prop: "remark", label: "备注" },
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
    // 视频时长转换
    secondToDate(val) {
      return secondToDate(val);
    },
    // 视频大小转换
    sizeTostr(size) {
      return sizeTostr(size);
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
        case "3": // 删除
          if (!data.id) return;
          this.$refs.remarkModal.init(data.id);
          break;
      }
    },
    sendPrompt(id){
      this.$http.put(`/sys/liveplaybacknew/sendImMsg/${id}`).then(res=>{
        if(res.data.code == 0){
          this.$message.success('发送提醒成功！');
        }else{
          this.$message.error(res.msg);
        }
      })
    },
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
    // 确认删除
    confirmHandle(remark, id, cb) {
      this.$http
        .delete("/sys/livePlayback/delete", { data: { id, remark } })
        .then(({ data: res }) => {
          cb();
          if (res.code == 0) {
            this.$message.success("删除视频成功");
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