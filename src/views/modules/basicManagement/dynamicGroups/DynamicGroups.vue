// 动态组

<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="content-box">
      <div class="left-box">
        <el-form
          :inline="true"
          :model="userForm"
          label-width="100%"
          @keyup.enter.native="loadName"
        >
          <el-form-item>
            <el-input
              style="width: 100%"
              v-model="groupMensName"
              placeholder="请输入动态组名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <div>
          <el-button @click="dialogFormVisible = true" plain type="primary"
            >动态组 +</el-button
          >
        </div>
        <div style="width: 100%; height: 100%">
          <div
            v-for="(item, index) in groupGroups"
            :key="index"
            style="
              width: 100%;
              height: 40px;
              margin-top: 5px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-left: 5px;
            "
            :class="item.id === chooseGroupId ? 'text-isActive' : ''"
            @click="chooseMens(item.id)"
          >
            <span>{{ item.name }}</span>
            <div style="margin-right: 5px; cursor: pointer">
              <i
                @click.stop="edite(index, item)"
                style="margin-right: 5px; cursor: pointer"
                class="el-icon-edit-outline"
              ></i>
              <i
                @click.stop="changeShowState(index, item)"
                class="el-icon-delete"
              ></i>
            </div>
          </div>
          <div v-if="groupGroupsFlag">
            <el-button @click="load" plain type="warning">{{
              loadMoreText
            }}</el-button>
          </div>
        </div>
      </div>

      <div class="right-box">
        <el-form
          class="headerTool"
          :inline="true"
          :model="dataForm"
          ref="dataForm"
          size="small"
          label-width="100px"
          label-position="right"
          @keyup.enter.native="queryPageWithGroupId(chooseGroupId)"
        >
          <el-form-item
            label="用户昵称"
            prop="name"
            v-if="isOpen || formItemCount >= 1"
          >
            <el-input
              style="width: 200px"
              v-model="dataForm.name"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            label="手机号"
            prop="tel"
            v-if="isOpen || formItemCount >= 2"
          >
            <el-input
              style="width: 200px"
              v-model="dataForm.tel"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>

          <div class="headerTool-search-btns">
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="queryPageWithGroupId(chooseGroupId)"
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
                  size="mini"
                  plain
                  icon="el-icon-sort-down"
                  type="primary"
                  @click="importXlx"
                  >导入</el-button
                >
              </el-form-item>
              <el-form-item>
                <el-button
                  size="mini"
                  plain
                  icon="el-icon-plus"
                  type="primary"
                  @click="addUser"
                  >新增</el-button
                >
              </el-form-item>
              <el-form-item>
                <el-button
                  plain
                  icon="el-icon-delete"
                  size="mini"
                  :disabled="dataListSelections.length === 0"
                  type="danger"
                  @click="deleteSelect()"
                  >批量移除</el-button
                >
              </el-form-item>
              <el-form-item>
                <el-button
                  plain
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="deleteAll()"
                  >一键移除</el-button
                >
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
                    @click="queryPageWithGroupId(chooseGroupId)"
                  ></el-button>
                </el-tooltip>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <el-table
          v-loading="loadingGroup"
          :data="groupMens"
          fit
          @selection-change="dataListSelectionChangeHandle"
          style="width: 100%"
          :height="siteContentViewHeight"
        >
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50"
            fixed="left"
            :height="siteContentViewHeight"
          ></el-table-column>
          <el-table-column label="用户昵称" prop="name" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号码" prop="phone" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.phone || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createDate" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createDate || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
                >移除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit"
          :total="groupMensTotal"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle"
          @current-change="pageCurrentChangeHandle"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="添加动态组"
      :visible.sync="dialogFormVisible"
      width="600"
    >
      <el-form :model="groupForm">
        <el-form-item label="动态组名称" :label-width="formLabelWidth">
          <el-input
            @input="changeValueNum"
            clearable
            maxlength="15"
            style="width: 400px"
            v-model="groupForm.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="saveGroup"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="修改动态组"
      :visible.sync="dialogEditeFormVisible"
      width="600"
    >
      <el-form :model="editeGroupForm">
        <el-form-item label="动态组名称" :label-width="formLabelWidth">
          <el-input
            @input="changeValueNum"
            clearable
            maxlength="15"
            style="width: 400px"
            v-model="editeGroupForm.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogEditeFormVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="editeGroup"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="导入"
      :visible.sync="dialogInputVisible"
      width="600"
    >
      <div
        style="
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        导入模板：模板.XLS
        <span @click="dowloadXlx" style="cursor: pointer; color: #66b1ff"
          >下载</span
        >
      </div>
      <el-upload
        class="upload-demo"
        accept=".xls, .xlsx"
        :action="uploadUrl"
        :on-error="handleError"
        :on-progress="handleProgress"
        :on-success="handleSuccess"
        :on-change="onChange"
        :before-upload="beforeUploadFile"
        multiple
        :show-file-list="false"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        v-if="percent === 0"
      >
        <el-button size="small" type="primary">+上传文件</el-button>
      </el-upload>
      <div
        style="
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        "
        v-else-if="percent === 1"
      >
        文件{{ uploadXlx }}正在上传
      </div>
      <div
        style="
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        "
        v-else-if="percent === 2"
      >
        文件{{ uploadXlx }}已经上传完毕，正在处理数据
      </div>
      <div
        style="
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        "
        v-else-if="percent === 3"
      >
        <p>文件{{ uploadXlx }}已上传完毕，导入数据完成</p>
        <p style="text-align: center">{{ uploadSuccessMsg }}</p>
        <p
          v-if="uploadFlag"
          @click="dowloadFalseXlx"
          style="text-align: center; cursor: pointer; color: #66b1ff"
        >
          点击下载导入失败文件
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogInputVisible = false"
          >关闭</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="dialogDeleteVisible"
      width="30%"
    >
      <span>确认删除该动态组吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDeleteVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="confirmDelte"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="一键移除"
      :visible.sync="dialogDeleteAllVisible"
      width="30%"
    >
      <span>确认全部移出动态组的成员?</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDeleteAllVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="confirmDelteAll"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="添加用户"
      :visible.sync="dialogUserFormVisible"
      top="20px"
      width="70%"
    >
      <el-form
        :inline="true"
        :model="userForm"
        size="small"
        label-width="100px"
        label-position="right"
        @keyup.enter.native="queryUserList()"
      >
        <el-form-item label="用户昵称">
          <el-input
            style="width: 200px"
            v-model="userForm.name"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            style="width: 200px"
            v-model="userForm.tel"
            placeholder="请输入"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="query"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" size="mini" @click="reset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataUserListLoading"
        :data="dataUserList"
        fit
        @selection-change="userListSelectionChangeHandle"
        style="width: 100%"
        max-height="500"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
          fixed="left"
        ></el-table-column>
        <el-table-column label="用户昵称" prop="name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" prop="phone" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="加入状态" prop="joinFlag" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.joinFlag === 0 ? "未加入" : "已加入" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createDate" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope" v-if="scope.row.joinFlag !== 1">
            <el-button
              type="text"
              size="small"
              icon="el-icon-plus"
              @click="saveSelectUser(scope.$index, scope.row)"
              >添加</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="userListPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="dataUserListTotal"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeUserHandle"
        @current-change="pageCurrentChangeUserHandle"
      >
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogUserFormVisible = false"
          >取 消</el-button
        >
        <el-button
          size="mini"
          :type="showBtn ? 'primary' : 'info'"
          @click="saveUser"
          >{{
            dataListSelectionUsers.length > 1 ? "批量添加" : "添加"
          }}</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      class="delete-dislog"
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>确认要移除吗？</span>
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
import Cookies from "js-cookie";
import mixinTableModule from "@/mixins/table-module";
export default {
  mixins: [mixinTableModule],
  data() {
    return {
      editeGroupForm: {
        name: "",
      },
      dataListSelections: [], // 数据列表，多选项
      dialogFormVisible: false,
      loadingGroup: false,
      dialogEditeFormVisible: false,
      formLabelWidth: "120px",
      groupForm: {
        name: "",
      },
      groupGroups: [],
      groupGroupsFlag: true,
      groupMensPage: 1,
      groupMensLimit: 10,
      groupMensTotal: 0,
      sysGroupId: "",
      fileList: [],
      dialogInputVisible: false,
      showState: 0,
      id: "",
      dialogVisible: false,
      uploadUrl: "",
      percent: 0,
      uploadXlx: "",
      uploadSuccessMsg: "",
      chooseGroupId: "",
      dataForm: {
        name: "",
        tel: "",
      },
      dataListSelections: [], // 数据列表，多选项
      loadingGroup: false,
      groupMens: [],
      page: 1,
      limit: 10,
      groupMensTotal: 0,
      userForm: {
        name: "",
        tel: "",
      },
      dialogUserFormVisible: false,
      dataUserListLoading: false,
      dataUserList: [],
      userListPage: 1, // 当前页码
      userListLimit: 10, // 每页数
      dataListSelectionUsers: [],
      dataUserListTotal: 0,
      dialogVisible: false,
      ids: [],
      showBtn: true,
      dialogDeleteVisible: false,
      groupMensName: "",
      loadMoreText: "加载更多",
      uploadFlag: false,
      dowloadFalseUrl: "",
      dialogDeleteAllVisible: false,
      deleteAllId: "",
    };
  },
  watch: {
    dialogInputVisible(n, o) {
      if (!n) {
        this.percent = 0;
        this.uploadXlx = "";
        this.uploadSuccessMsg = "";
        this.queryPageWithGroupId(this.chooseGroupId);
      }
    },
    dialogUserFormVisible(n, o) {
      if (n) {
        this.reset();
      }
    },
    groupGroups(n, o) {
      if (n.length >= this.groupMensTotal) {
        this.loadMoreText = "已加载全部";
        this.groupGroupsFlag = false;
      }
    },
  },
  created() {
    this.queryDynamicGroup();
  },
  activated() {},
  methods: {
    //一键移除
    deleteAll() {
      this.dialogDeleteAllVisible = true;
    },
    //一键移除确认
    confirmDelteAll() {
      this.$http
        .delete(`/sys/dynamicGroup/deleteByGroupId/${this.chooseGroupId}`)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message.success("移除成功!");
          this.dialogDeleteAllVisible = false;
          this.queryPageWithGroupId(this.chooseGroupId);
        })
        .catch((err) => {
          throw err;
        });
    },
    loadName() {
      this.groupMensPage = 1;
      this.groupGroups = [];
      this.loadMoreText = "加载更多";
      this.queryDynamicGroup();
    },
    //分页获取动态组
    load() {
      this.groupMensPage++;
      this.$http
        .get("/sys/dynamicGroup/page", {
          params: {
            page: this.groupMensPage,
            limit: this.groupMensLimit,
            name: this.groupMensName,
          },
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.groupGroups = [];
            this.groupMensTotal = 0;
            return this.$message.error(res.msg);
          }
          this.groupMensTotal = res.data.total;
          if (this.groupGroups.length >= this.groupMensTotal) {
            this.loadMoreText = "已加载全部";
            return;
          }
          this.groupGroups.push(...res.data.list);
        })
        .catch((err) => {
          throw err;
        });
    },
    changeValueNum() {
      if (this.groupForm.name.length >= 20) {
        this.$message.warning("最大字数为20字！");
      } else if (this.editeGroupForm.name.length >= 20) {
        this.$message.warning("最大字数为20字！");
      }
    },
    changeShowState(i, row) {
      this.dialogDeleteVisible = true;
      this.id = row.id;
      this.showState = row.showState;
    },
    //确认删除动态组
    confirmDelte() {
      let ids = [];
      ids.push(this.id);
      this.$http
        .delete("/sys/dynamicGroup", { data: ids })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.$message.success("删除成功!");
            this.dialogDeleteVisible = false;
            this.groupMensPage = 1;
            this.groupGroups = [];
            this.loadMoreText = "加载更多";
            this.queryDynamicGroup();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    edite(i, row) {
      this.dialogEditeFormVisible = true;
      this.editeGroupForm.name = row.name;
    },
    dowloadFalseXlx() {
      window.open(this.dowloadFalseUrl);
    },
    dowloadXlx() {
      window.open(
        "https://zego-live-video-back.oss-cn-beijing.aliyuncs.com/liveImages/gruopUserImport.xlsx"
      );
    },
    importXlx() {
      this.groupGroups.forEach((v) => {
        if (v.id === this.chooseGroupId) {
          this.sysGroupId = v.id;
        }
      });
      this.dialogInputVisible = true;
      this.uploadUrl = `${
        window.SITE_CONFIG["apiURL"]
      }/sys/dynamicGroupUser/import/${
        this.sysGroupId
      }?access_token=${Cookies.get("access_token")}`;
    },
    handleExceed(files, fileList) {
      // console.log(files,fileList)
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    handleError(err, file, fileList) {
      this.$message.error("上传文件失败！");
      this.fileList = [];
    },
    handleProgress(event, file, fileList) {
      // console.log(file, fileList);
      this.uploadXlx = file.name;
      if (event.percent >= 0 && event.percent < 100) {
        this.percent = 1;
      } else if (event.percent === 100) {
        this.percent = 2;
      }
    },
    handleSuccess(response, file, fileList) {
      if (
        response.code === 0 &&
        response?.data?.UploadDTO?.data?.url &&
        response?.data?.UploadDTO?.data?.url.length !== 0
      ) {
        this.percent = 3;
        this.uploadSuccessMsg = `上传${response.data.total}条数据,导入${response.data.successNum}个`;
        this.uploadFlag = true;
        this.dowloadFalseUrl = response?.data?.UploadDTO?.data?.url;
      } else if (response.code === 0 && !response?.data?.UploadDTO?.data?.url) {
        this.percent = 3;
        this.uploadSuccessMsg = `上传${response.data.total}条数据,导入${response.data.successNum}个`;
        this.uploadFlag = false;
      }
    },
    beforeUploadFile(file) {
      // const extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      const size = file.size / 1024 / 1024;
      // if (extension !== "xls") {
      //   console.log(extension)
      //   this.$message({
      //     message: "只能上传excel的文件",
      //     type: "warning",
      //     duration: 1000,
      //   });
      // } else if (extension !== "xlsx") {
      //   this.$message({
      //     message: "只能上传excel的文件",
      //     type: "warning",
      //     duration: 1000,
      //   });
      // }
      if (size > 10) {
        this.$message({
          message: "文件大小不得超过10M",
          type: "warning",
          duration: 1000,
        });
      }
    },
    onChange(file, fileList) {
      // console.log(file, fileList)
    },
    //动态组人员
    queryDynamicGroup() {
      this.$http
        .get("/sys/dynamicGroup/page", {
          params: {
            page: this.groupMensPage,
            limit: this.groupMensLimit,
            name: this.groupMensName,
          },
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.groupGroups = [];
            this.groupMensTotal = 0;
            return this.$message.error(res.msg);
          }
          this.groupGroups.push(...res.data.list);
          this.groupMensTotal = res.data.total;
          this.chooseGroupId = this.groupGroups[0].id;
          this.queryPageWithGroupId(this.chooseGroupId);
        })
        .catch((err) => {
          throw err;
        });
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.groupMensPage = 1;
      this.groupMensLimit = val;
      this.queryDynamicGroup();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.groupMensPage = val;
      this.queryDynamicGroup();
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 重置搜索条件
    resetDataForm(formName = "dataForm") {
      this.$refs[formName].resetFields();
      this.groupMensPage = 1;
      this.groupGroups = [];
      this.queryDynamicGroup();
    },
    //添加动态组
    saveGroup() {
      if (this.groupForm.name.length === 0) {
        this.$message.warning("动态组名称不能为空!");
        return;
      }
      this.$http
        .post("/sys/dynamicGroup", {
          name: this.groupForm.name,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.dialogFormVisible = false;
            return this.$message.error(res.msg);
          }
          this.$message.success("添加成功!");
          this.dialogFormVisible = false;
          this.groupMensPage = 1;
          this.groupGroups = [];
          this.queryDynamicGroup();
          this.groupForm.name = "";
        })
        .catch((err) => {
          throw err;
        });
    },
    // 编辑动态组
    editeGroup() {
      this.$http
        .put("/sys/dynamicGroup/update", {
          name: this.editeGroupForm.name,
          id: this.chooseGroupId,
          showState: this.showState,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.dialogEditeFormVisible = false;
            return this.$message.error(res.msg);
          }
          this.$message.success("修改成功!");
          this.dialogEditeFormVisible = false;
          this.groupMensPage = 1;
          this.groupGroups = [];
          this.queryDynamicGroup();
          this.editeGroupForm.name = "";
        })
        .catch((err) => {
          throw err;
        });
    },
    addUser() {
      // this.queryUserList();
      this.dialogUserFormVisible = true;
    },
    //查询新增的用户
    query() {
      this.userListPage = 1;
      this.queryUserList();
    },
    //获取未加入用户组
    queryUserList() {
      this.dataUserListLoading = true;
      this.$http
        .get("/sys/dynamicGroupUser/pageWithGroupIdNotJoin", {
          params: {
            page: this.userListPage,
            limit: this.userListLimit,
            name: this.userForm.name,
            phone: this.userForm.tel,
            groupId: this.chooseGroupId,
          },
        })
        .then(({ data: res }) => {
          this.dataUserListLoading = false;
          if (res.code !== 0) {
            this.dataUserList = [];
            this.dataUserListTotal = 0;
            return this.$message.error(res.msg);
          }
          this.dataUserList = res.data.list;
          this.dataUserListTotal = res.data.total;
        })
        .catch((err) => {
          this.dataUserListLoading = false;
          throw err;
        });
    },
    //添加
    saveSelectUser(index, row) {
      this.dataListSelectionUsers.push(row);
      this.$http
        .post("/sys/dynamicGroupUser", {
          weixinUserId: this.dataListSelectionUsers[0].id,
          sysGroupId: this.chooseGroupId,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            // this.dialogUserFormVisible = false;
            return this.$message.error(res.msg);
          }
          this.$message.success("添加成功!");
          // this.dialogUserFormVisible = false;
          this.dataListSelectionUsers = [];
          this.userListPage = 1;
          this.queryUserList();
          this.queryPageWithGroupId(this.chooseGroupId);
        })
        .catch((err) => {
          throw err;
        });
    },
    // 分页, 每页条数
    pageSizeChangeUserHandle(val) {
      this.userListPage = 1;
      this.userListLimit = val;
      this.queryUserList();
    },
    // 分页, 当前页
    pageCurrentChangeUserHandle(val) {
      this.userListPage = val;
      this.queryUserList();
    },
    //重置
    resetDataForm() {
      this.dataForm = {
        name: "",
        tel: "",
      };
      this.$refs.dataForm.resetFields();
      this.queryPageWithGroupId(this.chooseGroupId);
    },
    //重置
    reset() {
      this.userListPage = 1;
      this.userForm = {
        name: "",
        tel: "",
      };
      this.queryUserList();
    },
    //添加用户
    saveUser() {
      if (this.dataListSelectionUsers.length === 0) {
        this.$message({
          message: "未选择用户！",
          type: "warning",
          duration: 1000,
        });
        this.dialogUserFormVisible = false;
        return;
      } else if (this.dataListSelectionUsers.length === 1) {
        if (!this.showBtn) {
          this.$message.warning("不可添加已加入成员！");
        } else {
          this.$http
            .post("/sys/dynamicGroupUser", {
              weixinUserId: this.dataListSelectionUsers[0].id,
              sysGroupId: this.chooseGroupId,
            })
            .then(({ data: res }) => {
              if (res.code !== 0) {
                // this.dialogUserFormVisible = false;
                return this.$message.error(res.msg);
              }
              this.$message.success("添加成功!");
              // this.dialogUserFormVisible = false;
              this.dataListSelectionUsers = [];
              this.userListPage = 1;
              this.queryUserList();
              this.queryPageWithGroupId(this.chooseGroupId);
            })
            .catch((err) => {
              throw err;
            });
        }
      } else if (this.dataListSelectionUsers.length > 1) {
        if (!this.showBtn) {
          this.$message.warning("不可添加已加入成员！");
        } else {
          let list = [];
          this.dataListSelectionUsers.forEach((v) => {
            list.push({
              weixinUserId: v.id,
              sysGroupId: this.chooseGroupId,
            });
          });
          this.$http
            .post("/sys/dynamicGroupUser/addBatch", list)
            .then(({ data: res }) => {
              if (res.code !== 0) {
                // this.dialogUserFormVisible = false;
                return this.$message.error(res.msg);
              }
              this.$message.success("添加成功!");
              // this.dialogUserFormVisible = false;
              this.dataListSelectionUsers = [];
              this.userListPage = 1;
              this.queryUserList();
              this.queryPageWithGroupId(this.chooseGroupId);
            })
            .catch((err) => {
              throw err;
            });
        }
      }
    },
    //确认删除
    confirmShowState() {
      this.$http
        .delete("/sys/dynamicGroupUser", { data: this.ids })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message.success("删除成功!");
          this.ids = [];
          this.dialogVisible = false;
          this.queryPageWithGroupId(this.chooseGroupId);
        })
        .catch((err) => {
          throw err;
        });
    },
    //批量选择
    userListSelectionChangeHandle(val) {
      this.dataListSelectionUsers = val;
      this.showBtn = this.dataListSelectionUsers.every((v) => {
        return v.joinFlag === 0;
      });
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val;
      console.log(this.dataListSelections);
    },
    //删除
    handleDelete(index, row) {
      this.ids.push(row.id);
      this.dialogVisible = true;
    },
    //动态组人员
    queryPageWithGroupId(id) {
      this.loadingGroup = true;

      this.$http
        .get("/sys/dynamicGroupUser/pageWithGroupId", {
          params: {
            page: this.page,
            limit: this.limit,
            name: this.dataForm.name,
            phone: this.dataForm.tel,
            groupId: id,
          },
        })
        .then(({ data: res }) => {
          this.loadingGroup = false;
          if (res.code !== 0) {
            this.groupMens = [];
            this.groupMensTotal = 0;
            return this.$message.error(res.msg);
          }
          this.groupMens = res.data.list;
          this.groupMensTotal = res.data.total;
        })
        .catch((err) => {
          this.loadingGroup = false;
          throw err;
        });
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.page = 1;
      this.limit = val;
      this.queryPageWithGroupId(this.chooseGroupId);
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.page = val;
      this.queryPageWithGroupId(this.chooseGroupId);
    },
    //批量删除
    deleteSelect() {
      this.dataListSelections.forEach((v) => {
        this.ids.push(v.id);
      });
      this.dialogVisible = true;
    },
    //选择动态组
    chooseMens(id) {
      this.chooseGroupId = id;
      this.queryPageWithGroupId(this.chooseGroupId);
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
/deep/.content-box {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f6f7f9;
  height: calc(calc(100vh - 50px - 36px) - 2px);
  overflow-x: scroll;

  .left-box {
    flex: 2;
    margin-right: 10px;
    background: #fff;
    height: 100%;
    overflow-y: scroll;
    .el-button {
      width: 100%;
    }
    .text-isActive {
      border-left: 5px solid #409eff;
    }
    .el-form-item__content {
      display: block;
      margin-right: 0px;
      margin-bottom: 0px;
    }
    .el-form-item {
      display: block;
      margin-right: 0px;
      margin-bottom: 0px;
    }
  }
  .right-box {
    flex: 6;
    background: #fff;
  }
}

/deep/.upload-demo {
  display: flex;
  justify-content: center;
  align-items: center;
}

/deep/.el-dialog{
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
</style>