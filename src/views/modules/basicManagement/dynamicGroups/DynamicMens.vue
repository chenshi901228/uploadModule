// 动态组人员

<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="queryDynamicGroup()"
    >
      <el-form-item label="用户昵称">
        <el-input v-model="dataForm.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="dataForm.tel" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="queryDynamicGroup()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="dataListSelections.length !== 0"
          type="danger"
          @click="deleteSelect()"
          >批量删除</el-button
        >
      </el-form-item>
    </el-form>
    <div>
      <el-button style="margin-bottom: 10px" type="primary" @click="addUser"
        >添加</el-button
      >
    </div>
    <el-table
      v-loading="dataListLoading"
      :data="groupMens"
      border
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
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >移除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-groupMensPage="groupMensPage"
      :groupMensPage-sizes="[10, 20, 50, 100]"
      :groupMensPage-size="groupMensLimit"
      :total="groupMensTotal"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle"
    >
    </el-pagination>
    <el-dialog title="添加用户" :visible.sync="dialogUserFormVisible">
      <el-form
        :inline="true"
        :model="userForm"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item label="用户昵称">
          <el-input v-model="userForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userForm.tel" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="queryUserList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="dataListSelections.length !== 0"
            type="danger"
            @click="deleteUserSelect()"
            >批量删除</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataUserListLoading"
        :data="dataUserList"
        border
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
        <el-table-column
          width="150"
          label="用户昵称"
          prop="name"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="手机号码"
          prop="phone"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.phone || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="设备类型"
          prop="phoneModel"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.phoneModel || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="token值"
          prop="token"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.token || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          label="创建时间"
          prop="createDate"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createDate || "--" }}</span>
          </template>
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
              size="mini"
              type="danger"
              @click="handleDeleteUser(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
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
        <el-button @click="dialogUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">添加</el-button>
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
        :action="`http://192.168.250.195:28080/sys/dynamicGroupUser/import/${sysGroupId}?access_token=${access_token}`"
        :on-error="handleError"
        :on-progress="handleProgress"
        :on-success="handleSuccess"
        :before-upload="beforeUploadFile"
        multiple
        :show-file-list="false"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">+上传文件</el-button>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">完成</el-button>
      </div>
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
        tel: "",
      },
      dataListSelections: [], // 数据列表，多选项
      loadingGroup: false,
      groupMens: [],
      groupMensPage: 1,
      groupMensLimit: 10,
      groupMensTotal: 0,
      sysGroupId: "",
      fileList: [],
      dialogInputVisible: false,
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
      dataUserListTotal:0

    };
  },
  watch: {},
  created() {
    this.queryDynamicGroup();
    this.access_token = Cookies.get("access_token");
  },
  activated() {},
  methods: {
    addUser() {
      // if (this.sysGroupId.length === 0) {
      //   this.$message({
      //     message: "请选择动态组",
      //     type: "warning",
      //     duration: 1000,
      //   });
      //   return;
      // }
      this.queryUserList();
      this.dialogUserFormVisible = true;
    },
    dowloadXlx() {
      window.open(
        "https://zego-live-video-back.oss-cn-beijing.aliyuncs.com/liveImages/gruopUserImport.xlsx"
      );
    },
    importXlx() {
      if (this.sysGroupId.length === 0) {
        this.$message({
          message: "未选择动态组",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      this.dialogInputVisible = true;
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
    //删除
    handleDeleteUser(index, row) {
      let ids = [];
      ids.push(row.id);
      this.$http
        .delete("/sys/dynamicGroupUser", { data: ids })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message.success("删除成功!");
          this.queryUserList();
        })
        .catch((err) => {
          throw err;
        });
    },
    //批量删除
    deleteUserSelect() {
      let ids = [];
      this.dataListSelectionUsers.forEach((v) => {
        ids.push(v.id);
      });
      this.$http
        .delete("/sys/dynamicGroupUser", { data: ids })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message.success("删除成功!");
          this.queryUserList();
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
    reset() {
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
        this.$http
          .post("/sys/dynamicGroupUser", {
            weixinUserId: this.dataListSelectionUsers[0].id,
            sysGroupId: this.sysGroupId,
          })
          .then(({ data: res }) => {
            if (res.code !== 0) {
              this.dialogUserFormVisible = false;
              return this.$message.error(res.msg);
            }
            this.$message.success("添加成功!");
            this.dialogUserFormVisible = false;
            this.query(this.sysGroupId);
          })
          .catch((err) => {
            throw err;
          });
      } else if (this.dataListSelectionUsers.length > 1) {
        let list = [];
        this.dataListSelectionUsers.forEach((v) => {
          list.push({
            weixinUserId: v.id,
            sysGroupId: this.sysGroupId,
          });
        });
        this.$http
          .post("/sys/dynamicGroupUser/addBatch", list)
          .then(({ data: res }) => {
            if (res.code !== 0) {
              this.dialogUserFormVisible = false;
              return this.$message.error(res.msg);
            }
            this.$message.success("添加成功!");
            this.dialogUserFormVisible = false;
            this.query(this.sysGroupId);
          })
          .catch((err) => {
            throw err;
          });
      }
    },
    //批量选择
    userListSelectionChangeHandle(val) {
      this.dataListSelectionUsers = val;
    },
    handleExceed(files, fileList) {
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
      console.log(event);
    },
    handleSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.$message({
          message: "导入成功!",
          type: "success",
          duration: 1000,
        });
      }
      this.fileList = [];
      this.query(this.sysGroupId);
      this.dialogInputVisible = false;
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
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    //删除
    handleDelete(index, row) {
      let ids = [];
      ids.push(row.id);
      this.$http
        .delete("/sys/dynamicGroupUser", { data: ids })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message.success("删除成功!");
          this.queryDynamicGroup();
        })
        .catch((err) => {
          throw err;
        });
    },
    //动态组人员
    queryDynamicGroup() {
      this.loadingGroup = true;

      this.$http
        .get("/sys/dynamicGroup/page", {
          params: {
            page: this.groupMensPage,
            limit: this.groupMensLimit,
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
      this.groupMensPage = 1;
      this.groupMensLimit = val;
      this.queryDynamicGroup();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.groupMensPage = val;
      this.queryDynamicGroup();
    },
    //批量删除
    deleteSelect() {
      let ids = [];
      this.dataListSelections.forEach((v) => {
        ids.push(v.id);
      });
      this.$http
        .delete("/sys/dynamicGroupUser", { data: ids })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message.success("删除成功!");
          this.query(this.sysGroupId);
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
</style>