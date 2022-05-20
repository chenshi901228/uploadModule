// 动态组

<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form
      class="headerTool"
      :inline="true"
      :model="dataForm"
      ref="dataForm"
      size="small"
      label-width="100px"
      label-position="right"
      @keyup.enter.native="queryDynamicGroup"
    >
      <el-form-item
        label="动态组"
        prop="name"
        v-if="isOpen || formItemCount >= 1"
      >
        <el-input
          size="small"
          clearable
          style="width: 200px"
          v-model="dataForm.name"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="显示状态"
        prop="showState"
        v-if="isOpen || formItemCount >= 2"
      >
        <el-select
          size="small"
          style="width: 200px"
          :clearable="true"
          v-model="dataForm.showState"
          placeholder="显示状态"
        >
          <el-option label="显示" value="1"></el-option>
          <el-option label="隐藏" value="0"></el-option>
        </el-select>
      </el-form-item>

      <div class="headerTool-search-btns">
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="queryDynamicGroup"
            >{{ $t("query") }}</el-button
          >
          <el-button
            icon="el-icon-refresh"
            size="mini"
            @click="resetDataForm()"
            >{{ $t("reset") }}</el-button
          >
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
            <el-button
              plain
              icon="el-icon-delete"
              size="mini"
              v-if="dataListSelections.length !== 0"
              type="danger"
              @click="deleteSelect()"
              >批量删除</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              size="mini"
              plain
              icon="el-icon-plus"
              type="primary"
              @click="dialogFormVisible = true"
              >添加</el-button
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
                @click="queryDynamicGroup"
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
      ref="table"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
        fixed="left"
      ></el-table-column>
      <el-table-column label="动态组" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name || "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示状态" prop="showState" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.showState === 1 ? "显示" : "隐藏" || "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createBy" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createBy || "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate || "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        label="操作"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            icon="el-icon-sort-down"
            @click="importXlx(scope.$index, scope.row)"
            type="text"
            size="small"
            >导入</el-button
          >
          <el-button
            @click="edite(scope.$index, scope.row)"
            type="text"
            size="small"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-sort"
            @click="changeShowState(scope.$index, scope.row)"
            type="text"
            size="small"
            >{{ scope.row.showState === 1 ? "隐藏" : "显示" }}</el-button
          >
          <el-button
            icon="el-icon-view"
            @click="toDetail(scope.$index, scope.row)"
            type="text"
            size="small"
            >查看人员</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="groupMensPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="groupMensLimit"
      :total="groupMensTotal"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle"
    >
    </el-pagination>

    <el-dialog title="添加动态组" :visible.sync="dialogFormVisible" width="600">
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

    <el-dialog title="导入" :visible.sync="dialogInputVisible" width="600">
      <div style="margin-bottom: 20px">
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
      <div v-else-if="percent === 1">文件{{ uploadXlx }}正在上传</div>
      <div v-else-if="percent === 2">
        文件{{ uploadXlx }}已经上传完毕，正在处理数据
      </div>
      <div v-else-if="percent === 3">
        <p>文件{{ uploadXlx }}已上传完毕，导入数据完成</p>
        <p style="text-align: center">{{ uploadSuccessMsg }}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogInputVisible = false">关闭</el-button>
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
import Cookies from "js-cookie";
import mixinTableModule from "@/mixins/table-module";
export default {
  mixins: [mixinTableModule],
  data() {
    return {
      dataForm: {
        name: "",
        showState: "",
      },
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
      groupMens: [],
      groupMensPage: 1,
      groupMensLimit: 10,
      groupMensTotal: 0,
      sysGroupId: "",
      fileList: [],
      dialogInputVisible: false,
      groupId: "",
      showState: 0,
      id: "",
      dialogVisible: false,
      uploadUrl: "",
      percent: 0,
      uploadXlx: "",
      uploadSuccessMsg: "",
    };
  },
  watch: {
    dialogInputVisible(n, o) {
      if (!n) {
        this.percent = 0;
        this.uploadXlx = "";
        this.uploadSuccessMsg = "";
      }
    },
  },
  created() {
    this.queryDynamicGroup();
  },
  activated() {},
  methods: {
    changeValueNum() {
      if (this.groupForm.name.length >= 20) {
        this.$message.warning("最大字数为20字！");
      } else if (this.editeGroupForm.name.length >= 20) {
        this.$message.warning("最大字数为20字！");
      }
    },
    changeShowState(i, row) {
      this.dialogVisible = true;
      this.id = row.id;
      this.showState = row.showState;
    },
    //确认隐藏显示
    confirmShowState() {
      this.$http
        .put("/sys/dynamicGroup/showOrHide", {
          id: this.id,
          showState: this.showState === 1 ? 0 : 1,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          } else {
            this.dialogVisible = false;
            this.queryDynamicGroup();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    edite(i, row) {
      this.dialogEditeFormVisible = true;
      this.groupId = row.id;
      this.showState = row.showState;
      this.editeGroupForm.name = row.name;
    },
    toDetail(i, row) {
      this.groupId = row.id;
      this.$router.push({
        path: "/basicManagement-dynamicGroups-DynamicMens",
      });
      window.localStorage.setItem("groupId", this.groupId);
    },
    dowloadXlx() {
      window.open(
        "https://zego-live-video-back.oss-cn-beijing.aliyuncs.com/liveImages/gruopUserImport.xlsx"
      );
    },
    importXlx(i, row) {
      this.sysGroupId = row.id;
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
      if (response.code === 0) {
        this.percent = 3;
        // this.$message({
        //   message: `导入数据总数为${response.data.total}个,成功${
        //     response.data.successNum
        //   }个,失败${response.data.total - response.data.successNum}个`,
        //   type: "success",
        //   duration: 2000,
        // });
        this.uploadSuccessMsg = `上传${response.data.total}条数据,导入${response.data.successNum}个`;
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
    // closeUploadDialog() {
    //   this.percent = 0;
    //   this.fileList = [];
    //   this.queryDynamicGroup();
    //   this.dialogInputVisible = false;
    // },
    //动态组人员
    queryDynamicGroup() {
      this.loadingGroup = true;

      let dataObj = {};

      for (const key in this.dataForm) {
        if (this.dataForm[key] && this.dataForm[key].length !== 0) {
          dataObj[key] = this.dataForm[key];
        }
      }
      if (this.dataForm.showState) {
        dataObj.showState = Number(this.dataForm.showState);
      }

      this.$http
        .get("/sys/dynamicGroup/page", {
          params: {
            page: this.groupMensPage,
            limit: this.groupMensLimit,
            ...dataObj,
          },
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.groupMens = [];
            this.groupMensTotal = 0;
            this.loadingGroup = false;
            return this.$message.error(res.msg);
          }
          this.groupMens = res.data.list;
          this.groupMensTotal = res.data.total;
          this.loadingGroup = false;
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
          this.groupMens = [];
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
          id: this.groupId,
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
          this.queryDynamicGroup();
          this.editeGroupForm.name = "";
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
.diaBox {
  height: calc(calc(100vh - 50px - 38px - 66px) - 2px);
  position: relative;
  background: #fff;
}
.diaBoxLeft {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  bottom: 0;
  overflow: auto;
  padding: 10px;
  border: 5px solid #f5f7fa;
}
.diaBoxRight {
  position: absolute;
  top: 0;
  right: 0;
  left: 300px;
  bottom: 0;
  overflow: auto;
  padding: 10px;
  border: 5px solid #f5f7fa;
}
/deep/.el-dialog__body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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