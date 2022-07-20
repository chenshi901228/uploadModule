// 预告列表

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-live__liveList">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        label-width="100px"
        size="small"
        @keyup.enter.native="getDataList"
      >
        <el-form-item
          v-if="isOpen || formItemCount >= 1"
          label="直播主题"
          prop="liveTheme"
        >
          <el-input
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.liveTheme"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 2"
          label="主播"
          prop="anchorUser"
        >
          <el-input
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.anchorUser"
            placeholder="请输入姓名或手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 3"
          label="助手"
          prop="assistant"
        >
          <el-input
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.assistant"
            placeholder="请输入助手昵称或手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 4"
          label="预计开播时间"
          prop="startDate"
        >
          <el-date-picker
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.startDate"
            type="datetime"
            placeholder="选择日期时间"
            :formatter="dateFormat"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 5"
          label="实际开播时间"
          prop="factStartDate"
        >
          <el-date-picker
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.factStartDate"
            type="datetime"
            placeholder="选择日期时间"
            :formatter="dateFormat"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 6"
          label="投放人群"
          prop="dynamicGroupName"
        >
          <el-select
            style="width: 200px"
            v-model="dataForm.dynamicGroupName"
            filterable
            placeholder="请选择"
            :clearable="true"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 7"
          label="直播间ID"
          prop="livingRoomId"
        >
          <el-input
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.livingRoomId"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 8"
          label="预约状态"
          prop="appointmentState"
        >
          <el-select
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.appointmentState"
            placeholder="预约状态"
          >
            <el-option label="已结束" value="0"></el-option>
            <el-option label="预约中" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 9"
          label="直播状态"
          prop="liveState"
        >
          <el-select
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.liveState"
            placeholder="直播状态"
          >
            <el-option label="已下播" value="0"></el-option>
            <el-option label="直播中" value="1"></el-option>
            <el-option label="已禁播" value="2"></el-option>
            <el-option label="未开播" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 10"
          label="显示状态"
          prop="showState"
        >
          <el-select
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.showState"
            placeholder="显示状态"
          >
            <el-option label="显示" value="1"></el-option>
            <el-option label="隐藏" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isOpen || formItemCount >= 11"
          label="删除状态"
          prop="delFlg"
        >
          <el-select
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.delFlg"
            placeholder="显示状态"
          >
            <el-option label="已删除" value="1"></el-option>
            <el-option label="未删除" value="0"></el-option>
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
        <div class="headerTool-handle-btns">
          <div class="headerTool-btns-left">
            <el-button
              v-if="dataListSelections.length !== 0"
              size="mini"
              type="danger"
              plain
              icon="el-icon-delete"
              @click="deleteSelect()"
              >批量删除</el-button
            >
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="addPreview"
              >新增</el-button
            >
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="exportT()"
              >{{ $t("export") }}</el-button
            >
          </div>
          <div class="headerTool-btns-right">
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
        style="width: 100%"
        :height="siteContentViewHeight"
        ref="table"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
          fixed="left"
        ></el-table-column>
        <el-table-column
          width="150"
          label="直播宣传图"
          prop="frontCoverUrl"
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              <img
                style="width: '100%'; height: '100%'"
                class="frontCoverImg"
                :src="
                  row.frontCoverUrl || 'https://picsum.photos/400/300?random=1'
                "
                alt=""
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="直播主题"
          prop="liveTheme"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          width="100%"
          label="主播"
          prop="anchorUser"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          width="120"
          label="手机号码"
          prop="anchorTel"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          width="180"
          label="助手"
          prop="assistant"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          width="150"
          label="预计开播时间"
          prop="startDate"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          width="150"
          label="实际开播时间"
          prop="factStartDate"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.factStartDate || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="结束时间"
          prop="factEndDate"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.factEndDate || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="预计直播时长"
          prop="estimateLiveTime"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.estimateLiveTime ? scope.row.estimateLiveTime + '分钟' : "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="实际直播时长"
          prop="liveTime"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.liveTime ? scope.row.liveTime + '分钟' : "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100%"
          label="投放人群"
          prop="dynamicGroupName"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.dynamicGroupName || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100%"
          label="预约人数"
          prop="appointmentNum"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          width="100%"
          label="新增用户"
          prop="addUserNum"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          width="100%"
          label="预约状态"
          prop="delFlg"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.appointmentState === 0 ? "已结束" : "预约中"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100%"
          label="直播状态"
          prop="liveState"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.liveState === 0
                ? "已下播"
                : scope.row.liveState === 1
                ? "直播中"
                : scope.row.liveState === 2
                ? "已禁播"
                : "未开播"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100%"
          label="显示状态"
          prop="showState"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope" align="center">
            <span>{{ scope.row.showState === 0 ? "隐藏" : "显示" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100%"
          label="删除状态"
          prop="delFlg"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope" align="center">
            <span>{{
              scope.row.delFlg === 1
                ? "已删除"
                : scope.row.delFlg === 0
                ? "未删除"
                : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          label="直播间ID"
          prop="livingRoomId"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.livingRoomId || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100%" label="备注" prop="remark" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.remark || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="160"
          label="创建时间"
          prop="createDate"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          width="200"
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                scope.row.appointmentState !== 0 &&
                scope.row.delFlg !== 1 &&
                scope.row.liveState === 3
              "
              type="text"
              size="small"
              icon="el-icon-view"
              @click="showThis(scope.$index, scope.row)"
              >{{ scope.row.showState === 0 ? "显示" : "隐藏" }}</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-goods"
              @click="addProduct(scope.row)"
              >带货商品</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-user"
              @click="addAnchor(scope.row)"
              >推荐主播</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-user-solid"
              @click="assistant(scope.row)"
              >助手</el-button
            >
            <el-button
              v-if="
                scope.row.appointmentState === 1 && scope.row.liveState === 3 && scope.row.delFlg === 0
              "
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="handleEdite(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="scope.row.liveState === 3 && scope.row.delFlg === 0"
              type="text"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
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

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确认{{ showState === 0 ? "显示" : "隐藏" }}吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmShowState"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import mixinTableModule from "@/mixins/table-module";
export default {
  mixins: [mixinTableModule],
  components: {},
  data() {
    return {
      dataListLoading: false, // 数据列表，loading状态
      dataForm: {
        liveTheme: "",
        anchorUser: "",
        startDate: "",
        // factEndDate: "",
        factStartDate: "",
        dynamicGroupName: "",
        livingRoomId: "",
        liveState: "",
        showState: "",
        appointmentState: "",
        assistant: "",
        delFlg: "",
      },
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataList: [], // 数据列表
      dataListSelections: [], // 数据列表，多选项
      options: [],
      dialogFormVisible: false,
      ruleForm: {
        desc: "",
      },
      rules: {
        desc: [{ required: true, message: "请填写备注内容", trigger: "blur" }],
      },
      ids: [],
      dialogVisible: false,
      showState: 0,
      id: "",
    };
  },
  watch: {},
  created() {},
  activated() {
    this.query();
    this.getDynamicGroupList();
  },
  methods: {
    //带货商品
    addProduct(row) {
      let nowTime = new Date().getTime();
      let time = new Date(row.startDate).getTime();
      let timeFlg = 0;
      if ((nowTime - time) / 3600 / 1000 >= 2) {
        timeFlg = 0;
      } else {
        timeFlg = 1;
      }

      let authEdit = 0;
      if (row.liveState === 3 && timeFlg === 1) {
        authEdit = 1;
      } else {
        authEdit = 0;
      }

      this.$router.push({
        path: "/liveManagement-cargoGoods-CargoGoods",
        query: {
          liveId: row.id,
          anchorId: row.anchorUserId,
          type: 2,
          authEdit: authEdit,
        },
      });
    },
    //推荐主播
    addAnchor(row) {
      let nowTime = new Date().getTime();
      let time = new Date(row.startDate).getTime();
      let timeFlg = 0;
      if ((nowTime - time) / 3600 / 1000 >= 2) {
        timeFlg = 0;
      } else {
        timeFlg = 1;
      }
      let authEdit = 0;
      if (row.liveState === 3 && timeFlg === 1) {
        authEdit = 1;
      } else {
        authEdit = 0;
      }
      this.$router.push({
        name: "liveManagement-recommendAnchor-RecommendAnchor",
        query: {
          liveId: row.id,
          anchorId: row.anchorUserId,
          authEdit: authEdit,
        },
      });
    },
    //助手
    assistant(row) {
      let nowTime = new Date().getTime();
      let time = new Date(row.startDate).getTime();
      let timeFlg = 0;
      if ((nowTime - time) / 3600 / 1000 >= 2) {
        timeFlg = 0;
      } else {
        timeFlg = 1;
      }
      let authEdit = 0;
      if (row.liveState === 3 && timeFlg === 1) {
        authEdit = 1;
      } else {
        authEdit = 0;
      }
      this.$router.push({
        path: "/liveManagement-assistant-Assistant",
        query: {
          liveId: row.id,
          anchorId: row.anchorUserId,
          type: 2,
          authEdit:authEdit
        },
      });
    },
    query() {
      this.dataListLoading = true;
      let dataObj = {};

      for (const key in this.dataForm) {
        if (this.dataForm[key] && this.dataForm[key].length !== 0) {
          dataObj[key] = this.dataForm[key];
        }
      }

      if (this.dataForm.startDate) {
        dataObj.startDate = this.dateFormat(this.dataForm.startDate);
      }
      // else if (this.dataForm.factEndDate) {
      //   dataObj.factEndDate = this.dateFormat(this.dataForm.factEndDate);
      // }
      else if (this.dataForm.factStartDate) {
        dataObj.factStartDate = this.dateFormat(this.dataForm.factStartDate);
      } else if (this.dataForm.liveState) {
        dataObj.liveState = Number(this.dataForm.liveState);
      } else if (this.dataForm.showState) {
        dataObj.showState = Number(this.dataForm.showState);
      } else if (this.dataForm.transcribeFlg) {
        dataObj.transcribeFlg = Number(this.dataForm.transcribeFlg);
      } else if (this.dataForm.appointmentState) {
        dataObj.appointmentState = Number(this.dataForm.appointmentState);
      }

      this.$http
        .get("/sys/livePreview/page", {
          params: {
            page: this.page,
            limit: this.limit,
            ...dataObj,
          },
        })
        .then(({ data: res }) => {
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
    //创建直播
    createRoom(index, row) {
      console.log(index, row);
    },
    //显示与隐藏
    showThis(index, row) {
      this.dialogVisible = true;
      this.id = row.id;
      this.showState = row.showState;
    },
    //确认隐藏显示
    confirmShowState() {
      this.$http
        .put("/sys/livePreview/showOrHide", {
          id: this.id,
          showState: this.showState === 1 ? 0 : 1,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.dialogVisible = false;
            this.query();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    //编辑
    handleEdite(row) {
      this.$router.push({
        path: "/preview-editePreview-EditePreviewAll",
        query: {
          id: row.id,
          detailInfo: row,
        },
      });
    },
    //删除
    handleDelete(index, row) {
      this.dialogFormVisible = true;
      this.ids.push(row.id);
    },
    //批量删除
    deleteSelect() {
      this.dialogFormVisible = true;
      this.dataListSelections.forEach((v) => {
        this.ids.push(v.id);
      });
    },
    // 时间格式化
    dateFormat(time) {
      var t = new Date(time);
      if (!t) {
        return "";
      }
      let year = t.getFullYear();
      let month = this.dateIfAddZero(t.getMonth() + 1);
      let day = this.dateIfAddZero(t.getDate());
      let hours = this.dateIfAddZero(t.getHours());
      let minutes = this.dateIfAddZero(t.getMinutes());
      let seconds = this.dateIfAddZero(t.getSeconds());
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
    //补零
    dateIfAddZero: function (time) {
      return time < 10 ? "0" + time : time;
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
      console.log(val);
      this.dataListSelections = val;
    },
    //添加预告
    addPreview() {
      this.$router.push({
        path: "/preview-createPreview-CreatePreviewAll",
      });
    },
    //导出
    exportT() {
      let dataObj = {};

      for (const key in this.dataForm) {
        if (this.dataForm[key] && this.dataForm[key].length !== 0) {
          dataObj[key] = this.dataForm[key];
        }
      }

      if (this.dataForm.startDate) {
        dataObj.startDate = this.dateFormat(this.dataForm.startDate);
      }
      // else if (this.dataForm.factEndDate) {
      //   dataObj.factEndDate = this.dateFormat(this.dataForm.factEndDate);
      // }
      else if (this.dataForm.factStartDate) {
        dataObj.factStartDate = this.dateFormat(this.dataForm.factStartDate);
      } else if (this.dataForm.liveState) {
        dataObj.liveState = Number(this.dataForm.liveState);
      } else if (this.dataForm.showState) {
        dataObj.showState = Number(this.dataForm.showState);
      } else if (this.dataForm.transcribeFlg) {
        dataObj.transcribeFlg = Number(this.dataForm.transcribeFlg);
      } else if (this.dataForm.appointmentState) {
        dataObj.appointmentState = Number(this.dataForm.appointmentState);
      }

      this.$http
        .get("/sys/livePreview/export", {
          params: {
            ...dataObj,
          },
          responseType: "blob",
        })
        .then((res) => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);

          link.download = "直播预告列表"; //下载的文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(() => {});
    },
    //删除
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .delete("/sys/livePreview/delete", {
              data: { ids: this.ids, remark: this.ruleForm.desc },
            })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                this.ids = [];
                this.ruleForm.desc = "";
                return this.$message.error(res.msg);
              }
              this.ids = [];
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
    //获取投放人群
    getDynamicGroupList() {
      this.$http
        .get("/sys/dynamicGroup/getAllDynamicGroupList")
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.options = res.data;
        })
        .catch((err) => {
          throw err;
        });
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

/deep/.el-dialog {
  display: flex;
  display: -ms-flex; /* 兼容IE */
  flex-direction: column;
  -ms-flex-direction: column; /* 兼容IE */
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
/deep/.el-dialog .el-dialog__body {
  padding: 20px; /*这个不重要*/
  max-height: 75vh;
  flex: 1;
  -ms-flex: 1 1 auto; /* 兼容IE */
  overflow-y: auto;
  overflow-x: hidden;
}

/deep/.el-dialog__wrapper {
  overflow: hidden; /*隐藏ie和edge中遮罩的滚动条*/
}
</style>