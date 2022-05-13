<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="shareRecord"
        label-width="80px"
        @keyup.enter.native="getDataList()"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="分享用户" prop="nickName">
              <el-input
                size="small"
                v-model="dataForm.shareUserName"
                clearable
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="phone">
              <el-input
                size="small"
                v-model="dataForm.shareUserTel"
                clearable
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="分享类型" prop="delFlg">
              <el-select
                size="small"
                v-model="dataForm.shareType"
                clearable
                placeholder="请选择"
              >
                <el-option :value="0" label="预告分享"></el-option>
                <el-option :value="1" label="直播邀请"></el-option>
                <el-option :value="2" label="视频分享"></el-option>
                <el-option :value="3" label="其他分享"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <div v-if="isOpen">
            <el-row>
              <el-col :span="8">
                <el-form-item label="分享状态" prop="handlingStatus">
                  <el-select
                    size="small"
                    v-model="dataForm.shareState"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option :value="1" label="成功"></el-option>
                    <el-option :value="0" label="失败"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-col :span="24">
            <el-form-item style="float: right; padding-right: 10px">
              <el-button type="info" size="small" @click="exportHandle()">{{
                $t("export")
              }}</el-button>
              <el-button size="small" type="primary" @click="getDataList()">{{
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
        ref="table"
      >
        <el-table-column
          prop="shareUserName"
          label="分享用户"
          header-align="center"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="shareUserTel"
          label="手机号码"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="shareType"
          label="分享类型"
          min-width="150px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.shareType === 0
                ? "预告分享"
                : scope.row.shareType === 1
                ? "直播邀请"
                : scope.row.shareType === 2
                ? "视频分享"
                : scope.row.shareType === 3
                ? "其他分享"
                : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="shareUrl"
          label="页面路由"
          min-width="150px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          prop="createDate"
          label="创建时间"
          min-width="160px"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          prop="shareState"
          label="分享状态"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.shareState === 0
                  ? "失败"
                  : scope.row.shareState === 1
                  ? "成功"
                  : "--"
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="successEvent"
          label="成功事件"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.successEvent === 0
                ? "新人注册"
                : scope.row.successEvent === 1
                ? "进入直播"
                : scope.row.successEvent === 2
                ? "预约直播"
                : scope.row.successEvent === 3
                ? "观看视频"
                : "--"
            }}</span>
          </template></el-table-column
        >
        <el-table-column
          prop="passiveShareUserName"
          label="被分享人"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
          ><template slot-scope="scope">
            <span>{{ scope.row.passiveShareUserName || "--" }}</span>
          </template></el-table-column
        >
        <el-table-column
          prop="urpassiveShareUserTell"
          label="手机号码"
          min-width="120px"
          header-align="center"
          align="center"
          show-overflow-tooltip
          ><template slot-scope="scope">
            <span>{{ scope.row.urpassiveShareUserTell || "--" }}</span>
          </template></el-table-column
        >
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
import mixinViewModule from "@/mixins/view-module";
import { addDynamicRoute } from "@/router";
import Template from "../devtools/template.vue";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/liveShare/page",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/liveShare/export",
      },
      dataForm: {
        shareUserName: "",
        shareUserTel: "",
        shareType: "",
        shareState: "",
      },
      dataList: [{ createDate: 1 }],
      userId: "",

      otherViewHeight: 0, //搜索栏高度
      isOpen: false, //搜索栏展开/收起
    };
  },
  components: { Template },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.documentClientHeight;
      },
    },
    siteContentViewHeight() {
      var height =
        this.documentClientHeight -
        this.otherViewHeight -
        (50 + 40 + 30 + 40 + 47);
      return height;
    },
  },
  watch: {
    isOpen() {
      this.setOtherViewHeight();
    },
  },
  activated() {
    this.setOtherViewHeight();
    this.$nextTick(() => {
      this.$refs.table.doLayout();
    });
  },
  mounted() {
    this.$bus.$on("change", () => {
      this.getDataList();
    });
  },
  methods: {
    // 搜索栏高度设置
    setOtherViewHeight() {
      setTimeout(() => {
        if (document.querySelector(".headerTool")) {
          let h = document
            .querySelector(".headerTool")
            .getBoundingClientRect().height;
          this.otherViewHeight = Math.ceil(h);
        }
      }, 150);
    },
    // 搜索栏收起/展开
    open() {
      this.isOpen = !this.isOpen;
      this.resetDataForm();
    },

    // 重置搜索条件
    resetDataForm() {
      this.dataForm = {
        shareUserName: "",
        shareUserTel: "",
        shareType: "",
        shareState: "",
      };
      this.$refs.shareRecord.resetFields();
      this.getDataList();
    },
  },
};
</script>
<style  scoped>
.forbiddenAllBtn {
  width: 120px;
  height: 35px;
  background: #409eff;
  border-radius: 5px;
  color: #fff;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  margin: 10px 0;
}
</style>