// 预告列表

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
        label-position="right"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item
          label="直播主题"
          prop="liveTheme"
          v-show="isOpen || formItemCount >= 1"
        >
          <el-input
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.liveTheme"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="助手"
          prop="assistant"
          v-show="isOpen || formItemCount >= 2"
        >
          <el-input
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.assistant"
            placeholder="请输入助手昵称或手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="预计开播时间"
          prop="startDate"
          v-show="isOpen || formItemCount >= 3"
        >
          <el-date-picker
            :clearable="true"
            v-model="dataForm.startDate"
            type="datetime"
            style="width: 200px"
            placeholder="选择日期时间"
            :formatter="dateFormat"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="实际开播时间"
          prop="factStartDate"
          v-show="isOpen || formItemCount >= 4"
        >
          <el-date-picker
            :clearable="true"
            v-model="dataForm.factStartDate"
            type="datetime"
            style="width: 200px"
            placeholder="选择日期时间"
            :formatter="dateFormat"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="投放人群"
          prop="dynamicGroupName"
          v-show="isOpen || formItemCount >= 5"
        >
          <el-select
            v-model="dataForm.dynamicGroupName"
            filterable
            style="width: 200px"
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
          label="直播间ID"
          prop="livingRoomId"
          v-show="isOpen || formItemCount >= 6"
        >
          <el-input
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.livingRoomId"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="预约状态"
          prop="appointmentState"
          v-show="isOpen || formItemCount >= 7"
        >
          <el-select
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.appointmentState"
            placeholder="请选择"
          >
            <el-option label="已结束" :value="0"></el-option>
            <el-option label="预约中" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="直播状态"
          prop="liveState"
          v-show="isOpen || formItemCount >= 8"
        >
          <el-select
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.liveState"
            placeholder="请选择"
          >
            <el-option label="已下播" :value="0"></el-option>
            <el-option label="直播中" :value="1"></el-option>
            <el-option label="已禁播" :value="2"></el-option>
            <el-option label="未开播" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="显示状态"
          prop="showState"
          v-show="isOpen || formItemCount >= 9"
        >
          <el-select
            style="width: 200px"
            :clearable="true"
            v-model="dataForm.showState"
            placeholder="请选择"
          >
            <el-option label="显示" :value="1"></el-option>
            <el-option label="隐藏" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="isOpen || formItemCount >= 10" label="直播动态" prop="trendsOpen">
          <el-select
            clearable
            v-model="dataForm.trendsOpen"
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option label="已开启" :value="1"></el-option>
            <el-option label="已关闭" :value="0"></el-option>
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
            <el-form-item>
              <el-button
                plain
                size="mini"
                icon="el-icon-delete"
                v-if="dataListSelections.length !== 0"
                type="danger"
                @click="deleteSelect()"
                >批量删除</el-button
              >
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="addPreview()"
                >新增</el-button
              >
            </el-form-item>
            <!-- <el-form-item>
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="exportT()"
                >{{ $t("export") }}</el-button
              >
            </el-form-item> -->
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
          fixed="left"
          label="直播宣传图"
          prop="frontCoverUrl"
          align="center"
        >
          <template slot-scope="{ row }">
            <div>
              <img
                class="frontCoverImg"
                :src="
                  row.frontCoverUrl || require('@/assets/img/default_cover.jpg')
                "
                alt=""
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="直播主题"
          fixed="left"
          prop="liveTheme"
          align="center"
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
          prop="factEndDate"
          align="center"
        >
        </el-table-column>
        <el-table-column
          width="120"
          label="预计直播时长"
          prop="estimateLiveTime"
          align="center"
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
        >
          <template slot-scope="scope">
            <span>{{ scope.row.liveTime ? scope.row.liveTime + '分钟' : "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
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
          label="直播动态"
          prop="trendsOpen"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            {{ row.trendsOpen ? "已开启" : "已关闭" }}
          </template>
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
        <el-table-column
          width="160"
          label="创建时间"
          prop="createDate"
          align="center"
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
            <!-- --------2022-11-8修改(增加canOpen判断)：2022_11_07直播预告原型修改-------- -->
            <!-- <el-button
              v-if="
                scope.row.delFlg !== 1 &&
                scope.row.liveState === 3 &&
                timeFlag(scope.row.startDate) &&
                scope.row.alreadyLive === 0
              "
              type="text"
              size="small"
              icon="el-icon-plus"
              @click="createRoom(scope.$index, scope.row)"
              >创建直播</el-button
            > -->
            <el-button
              v-if="
                scope.row.delFlg !== 1 &&
                scope.row.liveState === 3 &&
                timeFlag(scope.row.startDate) &&
                scope.row.alreadyLive === 0 && 
                scope.row.canOpen === 1
              "
              type="text"
              size="small"
              icon="el-icon-plus"
              :loading="loading"
              @click="createRoom(scope.$index, scope.row)"
              >创建直播</el-button
            >
            <!-- --------2022-11-8修改：2022_11_07直播预告原型修改-------- -->
            <el-button
              v-if="scope.row.liveState === 3 && timeFlag(scope.row.startDate)"
              type="text"
              size="small"
              icon="el-icon-goods"
              @click="addProduct(scope.row)"
              >带货商品</el-button
            >
            <el-button
              v-if="scope.row.liveState === 3 && timeFlag(scope.row.startDate)"
              type="text"
              size="small"
              icon="el-icon-user"
              @click="addAnchor(scope.row)"
              >推荐主播</el-button
            >
            <el-button
              v-if="
                scope.row.liveState === 3 &&
                $hasPermission('anchor:list:assistant:preview') &&
                timeFlag(scope.row.startDate)
              "
              type="text"
              size="small"
              icon="el-icon-user-solid"
              @click="assistant(scope.row)"
              >助手</el-button
            >
            <!-- --------2022-11-8修改(去掉显示/隐藏按钮，编辑和删除去掉showState判断)：2022_11_07直播预告原型修改-------- -->
            <!-- <el-button
              icon="el-icon-sort"
              v-if="
                scope.row.delFlg !== 1 &&
                scope.row.liveState === 3 &&
                timeFlag(scope.row.startDate)
              "
              type="text"
              size="small"
              @click="showThis(scope.$index, scope.row)"
              >{{ scope.row.showState === 0 ? "显示" : "隐藏" }}</el-button
            > -->
            <el-button
              v-if="scope.row.delFlg !== 1 &&
                timeFlag(scope.row.startDate) &&
                scope.row.alreadyLive === 0"
              type="text"
              icon="el-icon-edit"
              size="small"
              @click="handle(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="scope.row.delFlg !== 1 &&
                timeFlag(scope.row.startDate) &&
                scope.row.alreadyLive === 0"
              type="text"
              icon="el-icon-delete"
              size="small"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
            <!-- --------2022-11-8修改：2022_11_07直播预告原型修改-------- -->
            <el-button
              type="text"
              icon="el-icon-view"
              size="small"
              v-if="scope.row.delFlg === 1"
              @click="checkRemark(scope.row)"
              >查看备注</el-button
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
      <span>确认删除该场直播预告?</span>
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
  data() {
    return {
      dataListLoading: false, // 数据列表，loading状态
      dataForm: {
        liveTheme: "",
        startDate: "",
        // factEndDate: "",
        factStartDate: "",
        dynamicGroupName: "",
        livingRoomId: "",
        liveState: "",
        showState: "",
        appointmentState: "",
        assistant: "",
        trendsOpen: null
      },
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      dataList: [], // 数据列表
      dataListSelections: [], // 数据列表，多选项
      options: [],
      dialogFormVisible: false,
      ids: [],
      dialogVisible: false,
      showState: 0,
      id: "",
      loading:false
    };
  },
  watch: {},
  activated() {
    this.query();
    this.getDynamicGroupList();
  },
  methods: {
    timeFlag(startDate) {
      let nowTime = new Date().getTime();
      let time = new Date(startDate).getTime();
      let flg = true;
      if ((nowTime - time) / 3600 / 1000 >= 2) {
        flg = false;
      } else {
        flg = true;
      }
      return flg;
    },
    //带货商品
    addProduct(row) {
      let nowTime = new Date().getTime();
      let time = new Date(row.startDate).getTime();
      let timeFlg = 0;
      let authEdit = 0
      if ((nowTime - time) / 3600 / 1000 >= 2) {
        timeFlg = 0;
      } else {
        timeFlg = 1;
      }
      if(row.liveState ===3 && timeFlg === 1 && row.alreadyLive === 0){
        authEdit = 1
      }else{
        authEdit = 0
      }
      this.$router.push({
        path: "/preview-cargoGoods-CargoGoods",
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
      let authEdit = 0
      if ((nowTime - time) / 3600 / 1000 >= 2) {
        timeFlg = 0;
      } else {
        timeFlg = 1;
      }
      if(row.liveState ===3 && timeFlg === 1 && row.alreadyLive === 0){
        authEdit = 1
      }else{
        authEdit = 0
      }
      this.$router.push({
        path: "/preview-recommendAnchor-RecommendAnchor",
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
      let authEdit = 0
      if ((nowTime - time) / 3600 / 1000 >= 2) {
        timeFlg = 0;
      } else {
        timeFlg = 1;
      }
      if(row.liveState ===3 && timeFlg === 1 && row.alreadyLive === 0){
        authEdit = 1
      }else{
        authEdit = 0
      }
      this.$router.push({
        path: "/preview-assistant-Assistant",
        query: {
          liveId: row.id,
          anchorId: row.anchorUserId,
          type: 2,
          authEdit: authEdit,
        },
      });
    },
    query() {
      this.dataListLoading = true;
      let dataObj = this.dataForm;

      if (this.dataForm.startDate) {
        dataObj.startDate = this.dateFormat(this.dataForm.startDate);
      }
      // else if (this.dataForm.factEndDate) {
      //   dataObj.factEndDate = this.dateFormat(this.dataForm.factEndDate);
      // }
      else if (this.dataForm.factStartDate) {
        dataObj.factStartDate = this.dateFormat(this.dataForm.factStartDate);
      } 
      this.$http
        .get("/sys/livePreview/pageOwn", {
          params: {
            page: this.page,
            limit: this.limit,
            ...this.$httpParams(dataObj),
            anchorUserId: this.$store.state.user.id,
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
      // this.$http.get("/sys/mixedflow/getLiving").then((res) => {
      //   //获取直播状态
      //   if (res.data.data) {
      //     this.$message({
      //       type: "warning",
      //       message: "当前正在直播中！",
      //     });
      //     return;
      //   } else {
      // const routeData = this.$router.resolve({
      //   name: "liveRoom",
      //   query: {
      //     liveTheme: row.liveTheme,
      //     livePreviewId: row.id,
      //   },
      // });
      // window.open(routeData.href, "_blank");
      this.loading=true
      this.$http
        .post("/sys/livePreview/createLiveInPreview", {
          id: row.id,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.loading=false
            return this.$message.error(res.msg);
          } else {
            this.$message.success("创建直播成功！请在直播列表中查看");
            this.loading=false
            this.getDataList();
          }
        })
        .catch((err) => {
          this.loading=false
          throw err;
        });
      //   }
      // });
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
      this.$router.push({
        path: "/preview-editePreview-EditePreview",
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
        path: "/preview-createPreview-CreatePreview",
      });
    },
    //导出
    exportT() {
      let dataObj = this.dataForm

      if (this.dataForm.startDate) {
        dataObj.startDate = this.dateFormat(this.dataForm.startDate);
      }
      // else if (this.dataForm.factEndDate) {
      //   dataObj.factEndDate = this.dateFormat(this.dataForm.factEndDate);
      // }
      else if (this.dataForm.factStartDate) {
        dataObj.factStartDate = this.dateFormat(this.dataForm.factStartDate);
      } 

      this.$http
        .get("/sys/livePreview/export", {
          params: {
            ...this.$httpParams(dataObj),
            anchorUserId: this.$store.state.user.id
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
    //获取投放人群
    getDynamicGroupList() {
      this.$http
        .get("/sys/dynamicGroup/getDynamicGroupList")
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
    //删除
    confirm() {
      this.$http
        .delete("/sys/livePreview/factDelete", {
          data: { ids: this.ids },
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.ids = [];
            return this.$message.error(res.msg);
          }
          this.ids = [];
          this.query();
          this.$message.success("删除成功!");
          this.dialogFormVisible = false;
        })
        .catch((err) => {
          throw err;
        });
    },
    // 查看备注
    checkRemark({ remark }) {
      this.$alert(remark || '暂无备注', '查看备注', {
        confirmButtonText: '关闭',
        callback: action => {}
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
    object-fit: cover;
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

/deep/.el-table__fixed{
  height: auto !important;
  bottom: 17px !important;
}
</style>