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
        @keyup.enter.native="getDataList"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="直播主题" prop="liveTheme">
              <el-input
                size="small"
                :clearable="true"
                v-model="dataForm.liveTheme"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主播" prop="anchorUser">
              <el-input
                size="small"
                :clearable="true"
                v-model="dataForm.anchorUser"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预计开播时间" prop="startDate">
              <el-date-picker
                size="small"
                :clearable="true"
                v-model="dataForm.startDate"
                type="datetime"
                style="width: 194px"
                placeholder="选择日期时间"
                :formatter="dateFormat"
                :editable="false"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <div v-if="isOpen">
            <el-row>
              <el-col :span="8">
                <el-form-item label="结束时间" prop="endDate">
                  <el-date-picker
                    size="small"
                    :clearable="true"
                    v-model="dataForm.endDate"
                    type="datetime"
                    style="width: 194px"
                    placeholder="选择日期时间"
                    :formatter="dateFormat"
                    :editable="false"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="投放人群" prop="dynamicGroupName">
                  <el-select
                    size="small"
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
              </el-col>
              <el-col :span="8">
                <el-form-item label="直播间ID" prop="livingRoomId">
                  <el-input
                    size="small"
                    :clearable="true"
                    v-model="dataForm.livingRoomId"
                    placeholder="请输入"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="直播状态" prop="liveState">
                  <el-select
                    size="small"
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
              </el-col>
              <el-col :span="8">
                <el-form-item label="显示状态" prop="showState">
                  <el-select
                    size="small"
                    :clearable="true"
                    v-model="dataForm.showState"
                    placeholder="显示状态"
                  >
                    <el-option label="显示" value="1"></el-option>
                    <el-option label="隐藏" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-col :span="24">
            <el-form-item style="float: right; padding-right: 10px">
              <el-button
                size="small"
                v-if="dataListSelections.length !== 0"
                type="danger"
                @click="deleteSelect()"
                >批量删除</el-button
              >
              <el-button size="small" type="primary" @click="exportT()"
                >导出</el-button
              >
              <!-- <el-button type="primary" @click="addPreview()">添加预告</el-button> -->
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
          label="封面图"
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
        >
        </el-table-column>
        <el-table-column
          width="100%"
          label="主播"
          prop="anchorUser"
          align="center"
        >
        </el-table-column>
        <el-table-column
          width="120"
          label="手机号码"
          prop="anchorTel"
          align="center"
        >
        </el-table-column>
        <el-table-column
          width="150"
          label="预计开播时间"
          prop="startDate"
          align="center"
        >
        </el-table-column>
        <el-table-column
          width="150"
          label="实际开播时间"
          prop="factStartDate"
          align="center"
        >
         <template slot-scope="scope">
            <span>{{ scope.row.factStartDate || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="结束时间"
          prop="endDate"
          align="center"
        >
        </el-table-column>
        <el-table-column
          width="100%"
          label="预计直播时长"
          prop="estimateLiveTime"
          align="center"
        >
        </el-table-column>
        <el-table-column
          width="100%"
          label="实际直播时长"
          prop="liveTime"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.liveTime || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100%"
          label="投放人群"
          prop="dynamicGroupName"
          align="center"
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
        >
        </el-table-column>
        <el-table-column
          width="100%"
          label="新增用户"
          prop="addUserNum"
          align="center"
        >
        </el-table-column>
        <el-table-column
          width="100%"
          label="预约状态"
          prop="appointmentState"
          align="center"
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
        >
          <template slot-scope="scope" align="center">
            <span>{{ scope.row.showState === 0 ? "隐藏" : "显示" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100%"
          label="直播间ID"
          prop="livingRoomId"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.livingRoomId || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100%" label="备注" prop="remark" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="160"
          label="创建时间"
          prop="createDate"
          align="center"
        >
        </el-table-column>
        <el-table-column
          width="120"
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.appointmentState !== 0"
              type="text"
              size="small"
              @click="showThis(scope.$index, scope.row)"
              >{{ scope.row.showState === 0 ? "显示" : "隐藏" }}</el-button
            >
            <!-- <el-button size="mini">禁播</el-button> -->
            <el-button
              v-if="scope.row.appointmentState !== 0"
              type="text"
              size="small"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
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
    <el-dialog title="删除" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确认{{ showState === 0 ? "显示" : "隐藏" }}吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmShowState">确 定</el-button>
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
        endDate: "",
        dynamicGroupName: "",
        livingRoomId: "",
        liveState: "",
        showState: "",
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
    query() {
      this.dataListLoading = true;
      let dataObj = {};

      for (const key in this.dataForm) {
        if (this.dataForm[key] &&this.dataForm[key].length !== 0) {
          dataObj[key] = this.dataForm[key];
        }
      }

      if (this.dataForm.startDate) {
        dataObj.startDate = this.dateFormat(this.dataForm.startDate);
      } else if (this.dataForm.endDate) {
        dataObj.endDate = this.dateFormat(this.dataForm.endDate);
      } else if (this.dataForm.liveState) {
        dataObj.liveState = Number(this.dataForm.liveState);
      } else if (this.dataForm.showState) {
        dataObj.showState = Number(this.dataForm.showState);
      } else if (this.dataForm.transcribeFlg) {
        dataObj.transcribeFlg = Number(this.dataForm.transcribeFlg);
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
    handle(index, row) {
      console.log(index, row);
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
        path: "/preview-createPreview-CreatePreview.vue",
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
      } else if (this.dataForm.endDate) {
        dataObj.endDate = this.dateFormat(this.dataForm.endDate);
      } else if (this.dataForm.liveState) {
        dataObj.liveState = Number(this.dataForm.liveState);
      } else if (this.dataForm.showState) {
        dataObj.showState = Number(this.dataForm.showState);
      } else if (this.dataForm.transcribeFlg) {
        dataObj.transcribeFlg = Number(this.dataForm.transcribeFlg);
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