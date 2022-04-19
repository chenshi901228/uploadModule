// 动态组人员

<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form
      class="headerTool"
      :inline="true"
      :model="dataForm"
      ref="dataForm"
      size="small"
      @keyup.enter.native="queryPageWithGroupId()"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="用户昵称" prop="name">
            <el-input
              v-model="dataForm.name"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号" prop="tel">
            <el-input
              v-model="dataForm.tel"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <div v-if="isOpen">
          <!-- <el-row>
          <el-col :span="6">
          </el-col>
        </el-row> -->
        </div>
        <el-col :span="8">
          <el-form-item style="float: right; padding-right: 10px">
            <el-button
              v-if="dataListSelections.length !== 0"
              type="danger"
              @click="deleteSelect()"
              >批量移除</el-button
            >
            <el-button
              style="margin-bottom: 10px"
              type="primary"
              @click="addUser"
              >添加</el-button
            >
            <el-button size="small" type="primary" @click="queryPageWithGroupId"
              >查询</el-button
            >
            <!-- <el-button size="small" @click="resetDataForm()">{{
              $t("reset")
            }}</el-button> -->
            <!-- <el-button 
                  size="small" 
                  type="primary"
                  @click="open"
              >
                  {{ isOpen ? "收起" : "展开"}}<i style="margin-left:10px" :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </el-button> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
            type="text"
            size="small"
            @click="handleDelete(scope.$index, scope.row)"
            >移除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-groupMensPage="page"
      :groupMensPage-sizes="[10, 20, 50, 100]"
      :groupMensPage-size="limit"
      :total="groupMensTotal"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle"
    >
    </el-pagination>
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
          label="用户昵称"
          prop="name"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="手机号码"
          prop="phone"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.phone || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="加入状态"
          prop="joinFlag"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.joinFlag === 0 ? "未加入" : "已加入" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createDate"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createDate || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="saveSelectUser(scope.$index, scope.row)"
              >添加</el-button
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
        <el-button size="small" @click="dialogUserFormVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="saveUser"
          >添加</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确认要移除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmShowState">确 定</el-button>
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
      groupId: "",
      dialogVisible:false,
      ids:[]
    };
  },
  watch: {},
  created() {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.groupId = window.localStorage.getItem("groupId");
      vm.queryPageWithGroupId(vm.groupId);
    });
  },
  activated() {},
  methods: {
    addUser() {
      this.queryUserList();
      this.dialogUserFormVisible = true;
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
            groupId: this.groupId,
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
      // let ids = [];
      // ids.push(row.id);
      // this.$http
      //   .delete("/sys/dynamicGroupUser", { data: ids })
      //   .then(({ data: res }) => {
      //     if (res.code !== 0) {
      //       return this.$message.error(res.msg);
      //     }
      //     this.$message.success("删除成功!");
      //     this.queryUserList();
      //   })
      //   .catch((err) => {
      //     throw err;
      //   });
      this.dataListSelectionUsers.push(row);
      this.$http
        .post("/sys/dynamicGroupUser", {
          weixinUserId: this.dataListSelectionUsers[0].id,
          sysGroupId: this.groupId,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.dialogUserFormVisible = false;
            return this.$message.error(res.msg);
          }
          this.$message.success("添加成功!");
          this.dialogUserFormVisible = false;
          this.dataListSelectionUsers = []
          this.queryPageWithGroupId();
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
    resetDataForm() {
      this.$refs.dataForm.resetFields();
      this.queryPageWithGroupId();
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
            sysGroupId: this.groupId,
          })
          .then(({ data: res }) => {
            if (res.code !== 0) {
              this.dialogUserFormVisible = false;
              return this.$message.error(res.msg);
            }
            this.$message.success("添加成功!");
            this.dialogUserFormVisible = false;
            this.dataListSelectionUsers = []
            this.queryPageWithGroupId();
          })
          .catch((err) => {
            throw err;
          });
      } else if (this.dataListSelectionUsers.length > 1) {
        let list = [];
        this.dataListSelectionUsers.forEach((v) => {
          list.push({
            weixinUserId: v.id,
            sysGroupId: this.groupId,
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
            this.dataListSelectionUsers = []
            this.queryPageWithGroupId();
          })
          .catch((err) => {
            throw err;
          });
      }
    },
    confirmShowState(){
      this.$http
        .delete("/sys/dynamicGroupUser", { data: this.ids })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message.success("删除成功!");
          this.ids = []
          this.dialogVisible = false
          this.queryPageWithGroupId();
        })
        .catch((err) => {
          throw err;
        });
    },
    //批量选择
    userListSelectionChangeHandle(val) {
      this.dataListSelectionUsers = val;
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val;
      console.log(this.dataListSelections)
    },
    //删除
    handleDelete(index, row) {
      this.ids.push(row.id);
      this.dialogVisible = true
    },
    //动态组人员
    queryPageWithGroupId() {
      this.loadingGroup = true;

      this.$http
        .get("/sys/dynamicGroupUser/pageWithGroupId", {
          params: {
            page: this.page,
            limit: this.limit,
            name: this.dataForm.name,
            phone: this.dataForm.tel,
            groupId: this.groupId,
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
      this.queryPageWithGroupId();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.page = val;
      this.queryPageWithGroupId();
    },
    //批量删除
    deleteSelect() {
      console.log(this.dataListSelections)
      this.dataListSelections.forEach((v) => {
        this.ids.push(v.id);
      });
      this.dialogVisible = true
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