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
        @keyup.enter.native="getUserList(diaTbas)"
      >
        <el-form-item v-if="isOpen || formItemCount >= 1" label="用户名称" prop="nickName">
          <el-input
            v-model="dataForm.nickName"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 2" label="手机号码" prop="phone">
          <el-input
            v-model="dataForm.phone"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 3" label="账号状态" prop="status">
          <el-select v-model="dataForm.status" clearable placeholder="请选择">
            <el-option label="正常" value="1">正常</el-option>
            <el-option label="停用" value="0">停用</el-option>
          </el-select>
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
              @click="getUserList(diaTbas)">{{ $t("query") }}</el-button>
            <el-button 
              icon="el-icon-refresh" 
              size="mini" 
              @click="resetDataForm(diaTbas)">{{ $t("reset") }}</el-button>
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
        v-loading="dataListLoading"
        :height="siteContentViewHeight"
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
          <template slot-scope="{ row }">
            <el-button
              v-if="$hasPermission('sys:user:update')&&diaTbas===1"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="addOrUpdateHandle(row.id)"
              >编辑</el-button
            >
            <!-- <el-button
              v-if="$hasPermission('sys:user:delete')"
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteHandle(row.id)"
              >{{ $t("delete") }}</el-button
            > -->
            <el-button
              icon="el-icon-close"
              type="text"
              size="small"
              v-if="!row.delFlg"
              @click="forbidden(row)"
              >{{ row.status != 0 ? "禁用" : "解除" }}</el-button
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
      <add-or-update
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="changeTbas(diaTbas)"
      ></add-or-update>
    </div>
  </el-card>
</template>

<script>
import debounce from 'lodash/debounce'
// import mixinViewModule from "@/mixins/view-module";
import AddOrUpdate from "./user-add-or-update";
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
      addDataForm:{
        id: '',
        mobile: '',
        roleIdList: [],
        postIdList: [],
        status: 1,
        username: '',
        deptId: '0',
        deptName: '',
      },
      dataForm: {
        nickName: "",
        phone: "",
        status: "",
      },
      tableItem:[],
      column:[
        {
          label:'登录账号',
          prop:'username'
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
      dataListLoading: false,
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0,
      otherViewHeight: 0,
      isOpen: false,
      formItemCount: 3, //搜索栏宽度能放的formItem个数
    };
  },
  components: {
    AddOrUpdate,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.changeTbas(1);
    });
  },
  watch: {
    isOpen() {
        this.setOtherViewHeight()
    },
    sidebarFold(val) {
        this.setHeaderSearchWidth(val)
    }
  },
  computed: {
    dataRule () {
      var validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.mobile') })))
        }
        callback()
      }
      return {
        username: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        mobile: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    },
    documentClientHeight: {
      get() {
          return this.$store.state.documentClientHeight;
      },
    },
    documentClientWidth: {
      get() {
          return this.$store.state.documentClientWidth;
      },
    },
    siteContentViewHeight() {
      var height = this.documentClientHeight - this.otherViewHeight - ( 50 + 36 + 55 + 40 + 47 + 2 );
      return height;
    },
    sidebarFold: {
      get() {
          return this.$store.state.sidebarFold;
      },
    }
  },
  created() {},
  activated() {
    this.setOtherViewHeight()
    this.setHeaderSearchWidth()

    // 防止table刷新错位
    if(this.$refs.table) {
        this.$nextTick(()=>{
        this.$refs.table.doLayout()
        })
    }
  },
  methods: {
    // 搜索栏高度设置
    setOtherViewHeight() {
        setTimeout(() => {
            if(document.querySelector(".headerTool")) {
                let h = document.querySelector(".headerTool").getBoundingClientRect().height
                this.otherViewHeight = Math.ceil(h)
            }
        },150)
    },
    // 计算搜索栏宽度能放的formItem个数
    setHeaderSearchWidth(val = false) {
        setTimeout(() => {
            let elFormWidth = this.documentClientWidth - (val ? 64 : 230) - 40
            this.formItemCount = Math.floor(elFormWidth / 300) - 1
        },150)
    },
    // 搜索栏收起/展开
    open() {
        this.isOpen = !this.isOpen
        // this.resetDataForm()
    },
    changeTbas(n){
      this.dataForm={
        nickName: "",
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
        url = '/sys/manage/weixinUser/managePage'
      }
      this.dataListLoading = true
      this.dataForm.limit = this.limit
      this.dataForm.page = this.page
      this.$http
        .get(url, {
          params: this.dataForm,
        })
        .then(({ data: res }) => {
          this.dataListLoading = false
          if (res.code !== 0) {
            this.diaDataList = [];
            this.total = 0;
            return this.$message.error(res.msg);
          }
          this.diaDataList = res.data.list;
          this.total = res.data.total;
        })
        .catch(() => {
          this.dataListLoading = false
        });
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.init()
      })
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
     // 重置搜索条件
    resetDataForm(n) {
      this.$refs.dataForm.resetFields()
      this.getUserList(n)
    },
    forbiddenHandle(type, data) {
      if(this.diaTbas === 2){
        let url = "/sys/anchor/info/updateAnchorStatus";
        this.$http
          .post(url, { disabledFlg: type, id: data.id, phone: data.mobile })
          .then(({ data: res }) => {
            if (res.code == 0) {
              this.$message.success("操作成功");
              this.query();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }else{
        let url = type
        ? "/sys/manage/weixinUser/startUsing"
        : "/sys/manage/weixinUser/forbiddenUsere";
        this.$http
          .put(url, { userIds: [data.id] })
          .then(({ data: res }) => {
            if (res.code == 0) {
              this.$message.success("操作成功");
              this.changeTbas(this.diaTbas)
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 禁用，解除用户
    forbidden(row) {
      if(this.diaTbas===2){
        if (row.liveState == 1 && row.disabledFlg != 1) return this.$message.error("主播正在直播，无法禁用此账号");
      }
      //单个操作
      this.$confirm(
        `确认[${row.status == 0 ? "解除" : "禁用"}]${row.realName||row.nickName}?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.forbiddenHandle(row.status == 0 ? 1 : 0, row);
        })
        .catch(() => {
          this.$message.info("已取消操作");
        });
    },
  },
};
</script>
<style scoped lang="scss">
.user-type-tab{
  display: flex;
  margin-bottom: 10px;
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