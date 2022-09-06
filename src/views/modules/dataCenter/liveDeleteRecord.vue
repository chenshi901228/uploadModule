<!--基础管理-上架商品-->

<template>
  <div>
    <el-card shadow="never" class="aui-card--fill">
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
          label="直播主题"
          prop="liveTheme"
          v-show="isOpen || formItemCount >= 1"
        >
          <el-input
            style="width: 200px"
            v-model.trim="dataForm.liveTheme"
            placeholder="请输入"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="主播"
          prop="username"
          v-show="isOpen || formItemCount >= 2"
        >
          <el-input
            style="width: 200px"
            v-model.trim="dataForm.username"
            placeholder="请输入姓名或手机号"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="助手"
          prop="assistant"
          v-show="isOpen || formItemCount >= 3"
        >
          <el-input
            style="width: 200px"
            v-model.trim="dataForm.assistant"
            placeholder="请输入助手昵称或手机号码"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="预计开播时间"
          prop="startDate"
          v-show="isOpen || formItemCount >= 4"
        >
          <el-date-picker
            style="width: 200px"
            v-model="dataForm.startDate"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="投放人群"
          prop="dynamicGroupName"
          v-show="isOpen || formItemCount >= 5"
        >
          <el-select
            size="small"
            style="width: 200px"
            v-model="dataForm.dynamicGroupName"
            placeholder="请选择"
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
        <el-form-item
          label="直播间ID"
          prop="livingRoomId"
          v-show="isOpen || formItemCount >= 6"
        >
          <el-input
            style="width: 200px"
            v-model.trim="dataForm.livingRoomId"
            placeholder="请输入"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="是否创建预告"
          prop="fromPreview"
          v-show="isOpen || formItemCount >= 7"
        >
          <el-select
            style="width: 200px"
            clearable
            v-model="dataForm.fromPreview"
            placeholder="请选择"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item
          label="删除人"
          prop="createUserName"
          v-show="isOpen || formItemCount >= 8"
        >
          <el-input
            style="width: 200px"
            v-model.trim="dataForm.createUserName"
            placeholder="请输入"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="删除人手机号"
          prop="createPhone"
          v-show="isOpen || formItemCount >= 9"
        >
          <el-input
            style="width: 200px"
            v-model.trim="dataForm.createPhone"
            placeholder="请输入"
            clearable
          >
          </el-input>
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
            <el-form-item>
              <!-- <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="exportHandle"
                >{{ $t("export") }}</el-button
              > -->
            </el-form-item>
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
          :sortable="
            ['transcribeFlg', 'liveState', 'showState'].includes(item.prop)
          "
        >
          <template slot-scope="{ row }">
            <!-- 封面图 -->
            <div v-if="item.prop == 'frontCoverUrl'">
              <img
                style="width: 100%; height: 60px"
                :src="
                  row.frontCoverUrl || 'https://picsum.photos/400/300?random=1'
                "
                alt=""
              />
            </div>
            <!-- 是否创建预告 -->
            <span v-else-if="item.prop == 'frompreview'">
              <el-tag size="small" :type="row.frompreview ? 'success' : 'danger'">{{
                row.frompreview ? "是" : "否"
              }}</el-tag>
            </span>
            <span v-else>
              {{ row[item.prop] || "-" }}
            </span>
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
    </el-card>
  </div>
</template>
<script>
import mixinTableModule from "@/mixins/table-module";
export default {
  mixins: [mixinTableModule],
  components: {
  },
  data() {
    return {
      mixinTableModuleOptions: {
        getDataListURL: "/sys/liveDeleteRecord/page", // 数据列表接口，API地址
        exportURL: "/sys/liveDeleteRecord/export", // 导出接口，API地址
      },
      dataForm: {
        liveThem:"",
        username:"",
        startDate:"",
        livingRoomId:"",
        fromPreview:"",
        dynamicGroupName:"",
        createUserName:"",
        createPhone:"",
        assistant:"",
      },

      tableItem: [
        { prop: "frontCoverUrl", label: "直播宣传图" },
        { prop: "liveTheme", label: "直播主题" },
        { prop: "username", label: "主播" },
        { prop: "phone", label: "手机号码" },
        { prop: "assistant", label: "助手" },
        { prop: "liveTime", label: "预计开播时长"},
        { prop: "dynamicGroupName", label: "投放人群" },
        { prop: "livingRoomId", label: "直播间ID" },
        { prop: "frompreview", label: "是否创建预告" },
        { prop: "remark", label: "备注" },
        { prop: "createUserName", label: "删除人" },
        { prop: "createPhone", label: "删除人手机号码" },
        { prop: "createDate", label: "删除时间" },
      ],
      getDynamicGroupLoading: false, //下拉框加载数据loading
      dynamicGroupOptions:[]
    };
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
  },
};
</script>