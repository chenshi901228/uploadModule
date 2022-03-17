// 预告列表

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__liveList">
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item label="直播主题">
          <el-input
            v-model="dataForm.liveTheme"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="主播">
          <el-input
            v-model="dataForm.anchorUser"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="开播时间">
          <el-input
            v-model="dataForm.startDate"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="dataForm.endDate" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="投放人群">
          <el-input
            v-model="dataForm.userGroup"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否录制">
          <el-select v-model="dataForm.transcribeFlg" placeholder="是否录制">
            <el-option label="未录制" value="0"></el-option>
            <el-option label="已录制" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联直播">
          <el-input
            v-model="dataForm.livingRoomId"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="直播状态">
          <el-select v-model="dataForm.liveState" placeholder="直播状态">
            <el-option label="已下播" value="0"></el-option>
            <el-option label="直播中" value="1"></el-option>
            <el-option label="已禁播" value="2"></el-option>
            <el-option label="未开播" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示状态">
          <el-select v-model="dataForm.showState" placeholder="直播状态">
            <el-option label="显示" value="0"></el-option>
            <el-option label="隐藏" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle()"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>

        <el-table-column
          header-align="center"
          align="center"
          v-for="item in tableItem"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <div v-if="item.prop == 'frontCoverUrl'">
              <img
                class="frontCoverImg"
                :src="
                  row.frontCoverUrl || 'https://picsum.photos/400/300?random=1'
                "
                alt=""
              />
            </div>
            <div v-else-if="item.prop == 'showMode'">
              {{ row.showMode ? "横屏" : "竖屏" }}
            </div>
            <div v-else>
              {{ row[item.prop] }}
            </div>
          </template>
          <template> </template>
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
export default {
  components: {},
  data() {
    return {
      dataListLoading: false, // 数据列表，loading状态
      dataForm: {
        liveTheme: "",
        anchorUser: "",
        startDate: "",
        endDate: "",
        userGroup: "",
        transcribeFlg: "",
        livingRoomId: "",
        liveState: "",
        showState: "",
      },
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataList: [], // 数据列表
      dataListSelections: [], // 数据列表，多选项

      tableItem: [
        { prop: "frontCoverUrl", label: "封面图" },
        { prop: "liveTheme", label: "直播主题" },
        { prop: "anchorUser", label: "主播" },
        { prop: "anchorTel", label: "手机号码" },
        { prop: "anchorUser", label: "开播时间" },
        { prop: "startDate", label: "结束时间" },
        { prop: "estimateLiveTime", label: "预计直播时长" },
        { prop: "liveTime", label: "实际直播时长" },
        { prop: "liveTime", label: "投放人群" },
        { prop: "appointmentNum", label: "预约人数" },
        { prop: "addUserNum", label: "新增用户" },
        { prop: "appointmentState", label: "预约状态" },
        { prop: "liveState", label: "直播状态" },
        { prop: "showState", label: "显示状态" },
        { prop: "startDate", label: "直播间ID" },
        { prop: "remark", label: "备注" },
        { prop: "createDate", label: "创建时间" },
        // { prop: "beginDate", label: "操作" },
      ],
    };
  },
  watch: {},
  created() {
    // this.query()
  },
  activated() {
    this.query();
  },
  methods: {
    query() {
      this.dataListLoading = true;
      this.$http
        .get("/sys/livePreview/page", {
          params: {
            page: this.page,
            limit: this.limit,
            // ...this.dataForm,
          },
        })
        .then(({ data: res }) => {
          console.log(res.data.list);
          this.dataListLoading = false;
          if (res.code !== 0) {
            this.dataList = [];
            this.total = 0;
            return this.$message.error(res.msg);
          }
          this.dataList = res.data.list;
          this.total = res.data.total;
        })
        .catch((err) => {
          this.dataListLoading = false;
          throw err;
        });
    },

    getDataList() {
      this.page = 1;
      this.query();
    },

    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.page = 1;
      this.limit = val;
      this.query();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.page = val;
      this.query();
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.mod-live__liveList {
  .frontCoverImg {
    width: 100%;
    height: 80px;
  }
}
</style>