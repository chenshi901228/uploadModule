<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__user">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        label-width="100px"
        label-position="right"
        @keyup.enter.native="changeTbas(diaTbas)"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="dataForm.username"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="gender">
          <el-input
            v-model="dataForm.phone"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号状态" prop="gender">
          <el-input
            v-model="dataForm.status"
            placeholder="请选择"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('dept.title')" prop="deptId">
          <ren-dept-tree
            v-model="dataForm.deptId"
            :placeholder="$t('dept.title')"
            :query="true"
          ></ren-dept-tree>
        </el-form-item> -->
        <!-- 搜索重置展开按钮 -->
        <div class="headerTool-search-btns">
          <el-form-item>
            <el-button 
              type="primary" 
              icon="el-icon-search" 
              size="mini"
              @click="changeTbas(diaTbas)">{{ $t("query") }}</el-button>
            <el-button 
              icon="el-icon-refresh" 
              size="mini" 
              @click="resetDataForm()">{{ $t("reset") }}</el-button>
            <!-- <el-button size="mini" plain @click="open">
              <i :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button> -->
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <el-button
                size="mini"
                v-if="$hasPermission('sys:dict:save')&&diaTbas==1"
                icon="el-icon-plus"
                plain
                type="primary"
                @click="addOrUpdateHandle()"
                >{{ $t("add") }}</el-button
              >
              <!-- <el-button
                type="warning"
                plain
                icon="el-icon-download"
                v-if="$hasPermission('sys:user:export')"
                size="mini"
                @click="exportHandle"
              >{{ $t("export") }}</el-button>
              <el-button
                size="mini"
                v-if="$hasPermission('sys:dict:delete')"
                icon="el-icon-delete"
                plain
                type="danger"
                @click="deleteHandle()"
                >{{ $t("deleteBatch") }}</el-button> -->
            </el-form-item>
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="small" icon="el-icon-refresh" circle @click="changeTbas(diaTbas)"></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="user-type-tab">
        <div
          class="diaBoxRight_tabBtns"
          @click="changeTbas(1)"
          :class="{ 'is-active': diaTbas === 1 }"
        >
          员工
        </div>
        <div
          class="diaBoxRight_tabBtns"
          @click="changeTbas(2)"
          :class="{ 'is-active': diaTbas === 2 }"
        >
          主播
        </div>
        <div
          class="diaBoxRight_tabBtns"
          @click="changeTbas(3)"
          :class="{ 'is-active': diaTbas === 3 }"
        >
          助手
        </div>
        <div
          class="diaBoxRight_tabBtns"
          @click="changeTbas(4)"
          :class="{ 'is-active': diaTbas === 4 }"
        >
          用户
        </div>
        <div
          class="diaBoxRight_tabBtns"
          @click="changeTbas(5)"
          :class="{ 'is-active': diaTbas === 5 }"
        >
          超级管理员
        </div>
      </div>
      <el-table
        :data="diaDataList"
        ref="table"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          v-for="(item,index) in tableItem"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <el-tag v-if="item.prop=='status'&&row.status === 0" size="small" type="danger">{{
              $t("user.status0")
            }}</el-tag>
            <el-tag v-else-if="item.prop=='status'&&row.status === 1"  size="small" type="success">{{
              $t("user.status1")
            }}</el-tag>
            <span v-else-if="item.prop=='roleStatus'">
              {{diaTbas==1?'员工':diaTbas==2?'主播':diaTbas==3?'助手':diaTbas==4?'用户':'超级管理员'}}
            </span>
            <span v-else>
              {{ row[item.prop] || "-" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              v-if="$hasPermission('sys:user:update')"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="addOrUpdateHandle(scope.row.id)"
              >{{ $t("update") }}</el-button
            >
            <el-button
              v-if="$hasPermission('sys:user:delete')"
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteHandle(scope.row.id)"
              >{{ $t("delete") }}</el-button
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
      <!-- 弹窗, 新增 / 修改 -->
      <!-- <add-or-update
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="changeTbas(diaTbas)"
      ></add-or-update> -->
      <el-dialog
        title="提示"
        :visible.sync="addOrUpdateVisible"
        width="30%"
        >
        <span>这是一段信息</span>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addOrUpdateVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrUpdateVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
// import mixinViewModule from "@/mixins/view-module";
// import AddOrUpdate from "./user-add-or-update";
export default {
  // mixins: [mixinViewModule],
  data() {
    return {
      // mixinViewModuleOptions: {
      //   getDataListURL: "/sys/user/page",
      //   getDataListIsPage: true,
      //   deleteURL: "/sys/user",
      //   deleteIsBatch: true,
      //   exportURL: "/sys/user/export",
      // },
      addOrUpdateVisible:false,
      diaTbas: 1,
      dataForm: {
        username: "",
        phone: "",
        status: "",
      },
      tableItem:[],
      column:[
        {
          label:'登录账号',
          prop:'mobile'
        },
        {
          label:'用户名称',
          prop:'realName'
        },
        {
          label:'手机号码',
          prop:'mobile'
        },
        {
          label:'用户类型',
          prop:'roleStatus'
        },
        {
          label:'用户角色',
          prop:'roleName'
        },
        {
          label:'创建时间',
          prop:'createDate'
        },
        {
          label:'账号状态',
          prop:'status'
        },
      ],
      columnTwo:[
        {
          label:'登录账号',
          prop:'phone'
        },
        {
          label:'用户名称',
          prop:'nickName'
        },
        {
          label:'手机号码',
          prop:'phone'
        },
        {
          label:'用户类型',
          prop:'roleStatus'
        },
        {
          label:'用户角色',
          prop:'roleName'
        },
        {
          label:'创建时间',
          prop:'createDate'
        },
        {
          label:'账号状态',
          prop:'status'
        },
      ],
      total:0,
      diaDataList: [],
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0,
    };
  },
  components: {
    // AddOrUpdate,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.changeTbas(1);
    });
  },
  created() {},
  methods: {
    changeTbas(n){
      this.dataForm={
        username: "",
        phone: "",
        status: "",
      }
      this.diaTbas = n
      this.diaDataList = [];
      this.total = 0;
      this.page = 1;
      if(n!=4){
        this.tableItem = this.column
        this.getUserList(n);
      }else{
        this.tableItem = this.columnTwo
        this.getUserList(n);
      }
    },
    getUserList(n){
      let url;
      if(n!=4){
        url = '/sys/user/page'
        this.dataForm.type = n
        this.dataForm.page = this.page
      }else{
        delete this.dataForm.type
        this.dataForm.nickName = this.dataForm.username
        url = '/sys/manage/weixinUser/managePage'
      }
      this.dataForm.limit = this.limit
      this.dataForm.page = this.page
      this.$http
        .get(url, {
          params: this.dataForm,
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.diaDataList = [];
            this.total = 0;
            return this.$message.error(res.msg);
          }
          this.diaDataList = res.data.list;
          this.total = res.data.total;
        })
        .catch(() => {});
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.dataForm.id = id
      //   this.$refs.addOrUpdate.init()
      // })
      console.log(id)
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.page = 1;
      this.limit = val;
      this.getUserList(this.diaTbas);
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.page = val;
      this.getUserList(this.diaTbas);
    },
  },
};
</script>
<style scoped lang="scss">
.user-type-tab{
  display: flex;
  .diaBoxRight_tabBtns {
    border-width: 0px;
    width: 100px;
    height: 45px;
    text-align: center;
    cursor: pointer;
    line-height: 45px;
    background: inherit;
    background-color: rgba(236, 245, 255, 1);
    border: none;
    border-radius: 3px;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .is-active {
    background-color: rgba(64, 158, 255, 1);
    color: #fff;
  }
}
</style>