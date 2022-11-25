<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="fans_group">
      <el-form
        class="headerTool"
        size="small"
        :inline="true"
        ref="groupNameForm"
        :model="groupNameForm"
        @keyup.enter.native="getfansGroupList()"
        label-width="100px"
      >
        <el-form-item label="群组名称" prop="groupName">
          <el-input
            clearable
            style="width: 200px"
            v-model="groupNameForm.groupName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="显示状态" prop="showStatus">
          <el-select v-model="groupNameForm.showStatus" clearable>
            <el-option :value="0" label="隐藏"></el-option>
            <el-option :value="1" label="显示"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="status">
          <el-select v-model="groupNameForm.status" placeholder="请选择审核状态">
            <el-option label="已通过" value="1"></el-option>
            <el-option label="审核中" value="-1"></el-option>
            <el-option label="已驳回" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- 搜索重置展开按钮 -->
        <div class="headerTool-search-btns">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getfansGroupList">{{ $t("query") }}</el-button>
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="reset('groupNameForm')">{{ $t("reset") }}</el-button>
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
                type="primary"
                plain
                icon="el-icon-plus"
                @click="showFansGroup(1)"
                style="marginBottom:10px;">创建企微粉丝群</el-button>
            </el-form-item>
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="small" icon="el-icon-refresh" circle @click="query"></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="fansGroupList"
        fit
        ref="table"
        style="width: 100%"
        @cell-dblclick="dblclick"
      >
      <el-table-column
      label="序号"
      type="index"
      >
    </el-table-column>
    <el-table-column
    show-overflow-tooltip
            prop="groupName"
            label="群组名称"
            header-align="center"
            align="center"
          >
    </el-table-column>
        <template v-for="(label, prop) in diaTableTitle">
          <el-table-column
            :prop="prop"
            :label="label"
            :key="prop"
            header-align="center"
            align="center"
          >
            <template slot-scope="{row}">
              <div v-if="prop=='groupImage'">
                <img
                  :src="row.groupImage"
                  v-if="row.groupImage"
                  alt=""
                  style="width: 50px; height: 50px"
                  @click="previewImg(row.groupImage)"
                />
                <span v-else>-</span>
              </div>
              <!-- 序号 -->
            <div v-else-if="prop == 'sort'">
              <el-input-number
                v-if="sortId === row.id && sortId !== ''"
                size="mini"
                v-model="sortVal"
                placeholder="请输入"
                @blur="sortId = ''"
                :min="0"
                :precision="0"
                 :controls="false"
                :max="9999"
                :id="'input' + row.id"
                @keyup.enter.native="userSelect"
                style="width:100%"
              ></el-input-number>
              <span v-else>
                {{ row.sort || "--" }}
              </span>
            </div>
              <span v-else-if="prop=='showStatus'">
                {{row.showStatus==1?'显示':'隐藏'}}
              </span>
              <span v-else-if="prop=='status'">
                {{row.status==1?'已通过': row.status== -1 ? '审核不通过' : '审核中'}}
              </span>
              <span v-else>
                {{ row[prop] || '-' }}
              </span>
            </template>
          </el-table-column>
        </template>
        <el-table-column
    show-overflow-tooltip
            prop="createDate"
            label="创建时间"
            header-align="center"
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
            <el-button
              size="small"
              type="text"
              icon="el-icon-view"
              v-if="scope.row.status!==0"
              @click="handleLookUser(scope.$index, scope.row)"
              >{{scope.row.showStatus==1?'隐藏':'显示'}}</el-button
            >
            <div v-if="scope.row.showStatus===0 && scope.row.status === 1">
              <el-button
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="showFansGroup(0,scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="delFansGroup(scope.row)"
              >删除</el-button
            >
            </div>
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
    <el-dialog
      title="二维码"
      :visible.sync="previewImgDia"
      width="30%"
      >
      <div style="textAlign:center">
        <img style="maxWidth:100%;" :src="previewImgUrl" alt="">
      </div>
    </el-dialog>
    <!-- 创建企微粉丝群弹窗 -->
    <el-dialog
      :title="`${ dialogVisibleGroup.title == 1 ? '创建': '编辑' }企微粉丝群`"
      :visible.sync="dialogVisibleGroup.dialogVisible"
      @close="cancelCreateGroup"
      width="30%"
      >
      <el-form ref="createGroupform" :model="createGroup" :rules="createGroupRules" label-width="80px">
        <el-form-item label="群组名称" prop="groupName">
          <el-input v-model="createGroup.groupName" maxlength="16" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="群二维码" required>
          <upload
            :fileList="fileList"
            :limit="1"
            :fileType="['png', 'jpg', 'jpeg']"
            ref="uploadFile"
            @uploadSuccess="uploadSuccess"
            @uploadRemove="uploadRemove"
          ></upload>
          <span>群二维码大小限制为300px*300px</span>
        </el-form-item>
        <el-form-item style="textAlign:right;">
          <el-button size="small" @click="cancelCreateGroup">取 消</el-button>
          <el-button :disabled="submitLoading" :loading="submitLoading" size="small" type="primary" @click="confirmCreateGroup">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加成员弹窗 -->
    <!-- <el-dialog
      title="添加成员"
      :visible.sync="dialogVisibleAddUser"
      width="70%"
      >
      <el-form
        size="small"
        :inline="true"
        :model="noJoinFansUserForm"
        @keyup.enter.native="getNoJoinFansUserList()"
        label-width="100px"
      >
        <el-form-item label="用户昵称">
          <el-input style="width: 200px" v-model="noJoinFansUserForm.nickName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input style="width: 200px" v-model="noJoinFansUserForm.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="等级">
          <el-select @visible-change="getFansLevels" style="width: 200px" v-model="noJoinFansUserForm.level" clearable>
            <el-option v-for="item in fansLevelsOptions" :key="item" :value="item" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="粉丝团身份">
          <el-select style="width: 200px" v-model="noJoinFansUserForm.userType" placeholder="请选择" clearable>
            <el-option :value="0" label="普通用户"></el-option>
            <el-option :value="1" label="会长"></el-option>
            <el-option :value="2" label="副会长"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-plus" size="mini" type="primary" @click="addUserJoinGroup">批量添加</el-button>
          <el-button icon="el-icon-search" size="mini" type="primary" @click="getNoJoinFansUserList">查询</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="reset('add')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="noJoinUserListLoading"
        :data="noJoinFansUserList"
        fit
        @selection-change="noJoinUserSelectionChangeHandle"
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
        <template v-for="(label, prop) in noJoinColumns">
          <el-table-column
            :prop="prop"
            :label="label"
            :key="prop"
            header-align="center"
            align="center"
            v-if="prop === 'avatarUrl'"
          >
            <template slot-scope="scope">
              <img
                :src="scope.row.avatarUrl || require('@/assets/img/default_avatar.png')"
                alt=""
                style="width: 60px; height: 60px; object-fit: cover;"
              />
            </template>
          </el-table-column>
          <el-table-column
            :prop="prop"
            :label="label"
            :key="prop"
            header-align="center"
            align="center"
            v-else-if="prop === 'userType'"
          >
            <template slot-scope="scope">
              <span>{{scope.row.userType==0?'普通用户':scope.row.userType==1?'会长':'副会长'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :prop="prop"
            :label="label"
            :key="prop"
            header-align="center"
            align="center"
            show-overflow-tooltip
            v-else
          >
          </el-table-column>
        </template>
        <el-table-column
          width="200"
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="addUserJoinGroup(scope.$index, scope.row)"
              >添加</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          :current-page="noJoinFansUserForm.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="noJoinFansUserForm.limit"
          :total="noJoinFansUserTotal"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="noJoinFansPageSizeChange"
          @current-change="noJoinFansCurrentChange"
        >
      </el-pagination>
    </el-dialog> -->
    <!-- 查看成员弹窗 -->
    <!-- <el-dialog
      title="群组成员"
      :visible.sync="dialogVisibleLookUser"
      width="70%"
      >
      <el-form
        size="small"
        :inline="true"
        :model="hasJoinFansUserForm"
        @keyup.enter.native="getHasJoinFansUserList()"
        label-width="100px"
      >
        <el-form-item label="用户昵称">
          <el-input style="width: 200px" v-model="hasJoinFansUserForm.nickName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input style="width: 200px" v-model="hasJoinFansUserForm.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="等级">
          <el-select @visible-change="getFansLevels" style="width: 200px" v-model="hasJoinFansUserForm.level" clearable>
            <el-option v-for="item in fansLevelsOptions" :key="item" :value="item" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="粉丝团身份">
          <el-select style="width: 200px" v-model="hasJoinFansUserForm.userType" placeholder="请选择" clearable>
            <el-option :value="0" label="普通用户"></el-option>
            <el-option :value="1" label="会长"></el-option>
            <el-option :value="2" label="副会长"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 200px">
          <el-button icon="el-icon-search" size="mini" type="primary" @click="getHasJoinFansUserList">查询</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="reset('get')">重置</el-button>
        </el-form-item>
      </el-form>
      <span style="font-weight: 700">当前所在组：{{currentGroupName}}</span>
      <el-table
        v-loading="hasJoinUserListLoading"
        :data="hasJoinFansUserList"
        fit
        style="width: 100%"
        max-height="500"
      >
        <template v-for="(label, prop) in hasJoinColumns">
          <el-table-column
            :prop="prop"
            :label="label"
            :key="prop"
            header-align="center"
            align="center"
            v-if="prop === 'avatarUrl'"
          >
            <template slot-scope="scope">
              <img
                :src="scope.row.avatarUrl || require('@/assets/img/default_avatar.png')"
                alt=""
                style="width: 60px; height: 60px; object-fit: cover;"
              />
            </template>
          </el-table-column>
          <el-table-column
            :prop="prop"
            :label="label"
            :key="prop"
            header-align="center"
            align="center"
            v-else-if="prop === 'userType'"
          >
            <template slot-scope="scope">
              <span>{{scope.row.userType==0?'普通用户':scope.row.userType==1?'会长':'副会长'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :prop="prop"
            :label="label"
            :key="prop"
            header-align="center"
            align="center"
            show-overflow-tooltip
            v-else
          >
          </el-table-column>
        </template>
        <el-table-column
          width="200"
          label="操作"
          fixed="right"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="removeUserJoinGroup(scope.$index, scope.row)"
              >移除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          :current-page="hasJoinFansUserForm.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="hasJoinFansUserForm.limit"
          :total="hasJoinFansUserTotal"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="hasJoinFansPageSizeChange"
          @current-change="hasJoinFansCurrentChange"
        >
      </el-pagination>
    </el-dialog> -->
  </el-card>
</template>

<script>
import Upload from '@/components/common/custom-upload'
import mixinTableModule from '@/mixins/table-module'
export default {
  mixins: [mixinTableModule],
  components: {
    Upload
  },
  data () {
    var validateGroupName = (rule, value, callback) => {
      if (value && !value.match(/^[\u4E00-\u9FA5A-Za-z0-9]{0,}$/)) {
        return callback(new Error('限制16位汉字、字母或数字'))
      }
      callback()
    }
    return {
      previewImgDia: false,
      previewImgUrl: '',
      dialogVisibleGroup: { // 创建群组弹窗
        title: null,
        id: null,
        dialogVisible: false
      }, // 弹窗标题
      dataListLoading: false,
      sortVal: '',
      sortId: '',
      submitLoading: false, // 创建群组loading
      // dialogVisibleAddUser:false,//添加成员弹窗
      // dialogVisibleLookUser:false,//添加成员弹窗
      // noJoinUserListLoading:false,
      // hasJoinUserListLoading:false,
      // dataListSelectionUsers:[],
      groupNameForm: {
        groupName: '',
        delFlg: ''
      },
      limit: 10,
      page: 1,
      total: 0, // 群组条数
      params: {
        anchorId: ''
      },
      diaTableTitle: {
        // groupName: '群组名称',
        groupImage: '群组二维码',
        showStatus: '显示状态',
        status: '审核状态',
        sort: '排序',
        // createDate: '创建时间'
      },
      fansGroupList: [],
      createGroup: {
        groupName: ''
      },
      createGroupRules: {
        groupName: [
          { required: true, message: '请输入群组名称', trigger: 'blur' },
          { validator: validateGroupName, trigger: 'change' }
        ]
      },
      // noJoinFansUserForm:{//未加入群组的粉丝团成员查询
      //   nickName:'',
      //   phone:'',
      //   level:'',
      //   userType:'',
      //   limit:10,
      //   page:1,
      //   anchorId:this.$route.query.anchorId,
      // },
      // noJoinFansUserList:[],
      // noJoinFansUserTotal:0,//未加入群组的粉丝团成员总数
      // noJoinColumns:{
      //   avatarUrl:"用户头像",
      //   nickName:"用户昵称",
      //   phone:"手机号码",
      //   level:"用户等级",
      //   userType:"粉丝团身份",
      //   createDate:"入群时间",
      // },
      // groupId:'',//群组ID
      // hasJoinFansUserForm:{//未加入群组的粉丝团成员查询
      //   groupId:'',
      //   nickName:'',
      //   phone:'',
      //   level:'',
      //   userType:'',
      //   limit:10,
      //   page:1,
      // },
      // hasJoinFansUserList:[],
      // hasJoinFansUserTotal:0,//未加入群组的粉丝团成员总数
      // hasJoinColumns:{
      //   avatarUrl:"用户头像",
      //   nickName:"用户昵称",
      //   phone:"手机号码",
      //   level:"用户等级",
      //   userType:"粉丝团身份",
      //   createDate:"入群时间",
      // },
      // fansLevelsOptions: [], //粉丝等级options
      // currentGroupName: "", //当前查看的群组
      fileList: []
    }
  },
  activated () {
    this.params.anchorId = this.$route.query.anchorId
    this.getfansGroupList()
  },
  methods: {
    // 排序
    dblclick (row, column, cell, event) {
      if (column.property === 'sort') {
        this.sortId = row.id
        this.sortVal = row.sort
        this.$nextTick(() => {
          const id = '#' + 'input' + this.sortId
          document.querySelector(id).focus()
        })
      }
    },
    // 回车确认
    userSelect () {
      if (!this.sortVal) {
        return this.$message.warning('序号不能为空或0')
      }
      this.$http
        .put('/sys/weixinfansgroup/updateSortNum', {
          sort: this.sortVal,
          id: this.sortId
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.sortId = ''
            this.sortVal = ''
            this.getfansGroupList()
          }
        })
        .catch((err) => {
          throw err
        })
    },
    showFansGroup (status, row) {
      this.dialogVisibleGroup.title = status
      this.dialogVisibleGroup.dialogVisible = true
      if (status !== 1) {
        this.createGroup.groupName = row.groupName
        this.dialogVisibleGroup.id = row.id
        this.fileList.push({ url: row.groupImage })
      }
    },
    delFansGroup (row) {
      this.submitLoading = true
      this.$confirm('确定要删除该企微粉丝群', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/sys/weixinfansgroup', { data: [row.id] }).then(({ data: res }) => {
        this.submitLoading = false
        if (res.code !== 0) return this.$message.error(res.msg)
        this.getfansGroupList()
      }).catch(err => {
        this.submitLoading = false
        console.error(err)
      })
      })

    },
    previewImg (url) { // 预览
      if (url) {
        this.previewImgUrl = url
        this.previewImgDia = true
      }
    },
    // 二维码上传
    uploadSuccess (file) {
      this.fileList.push(file)
    },
    uploadRemove (file) {
      this.fileList = this.fileList.filter(item => item.uid != file.uid)
    },
    // 批量选择
    // noJoinUserSelectionChangeHandle(val) {
    //   this.dataListSelectionUsers = val;
    // },
    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.page = 1
      this.limit = val
      this.query()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.page = val
      this.query()
    },
    // 未加入群组的粉丝列表分页
    // noJoinFansPageSizeChange(val){
    //   this.noJoinFansUserForm.page = 1;
    //   this.noJoinFansUserForm.limit = val;
    //   this.getNoJoinFansUserList();
    // },
    // //未加入群组的粉丝列表分页
    // noJoinFansCurrentChange(val){
    //   this.noJoinFansUserForm.page = val;
    //   this.getNoJoinFansUserList();
    // },
    // //已经加入群组的粉丝列表分页
    // hasJoinFansPageSizeChange(val){
    //   this.hasJoinFansUserForm.page = 1;
    //   this.hasJoinFansUserForm.limit = val;
    //   this.getHasJoinFansUserList();
    // },
    // //已经加入群组的粉丝列表分页
    // hasJoinFansCurrentChange(val){
    //   this.hasJoinFansUserForm.page = val;
    //   this.getHasJoinFansUserList();
    // },
    query () {
      this.dataListLoading = true
      this.$http.get('/sys/weixinfansgroup/page', { params: { ...this.$httpParams(this.groupNameForm), ...this.params } }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.fansGroupList = []
          this.total = 0
          return this.$message.error(res.msg)
        }
        this.fansGroupList = res.data.list
        this.total = res.data.total
      }).catch(err => {
        this.dataListLoading = false
      })
    },
    // 获取群组列表
    getfansGroupList () {
      this.page = 1
      this.query()
    },
    // 取消创建群组
    cancelCreateGroup () {
      this.dialogVisibleGroup.dialogVisible = false
      this.createGroup.groupName = ''
      this.fileList = []
    },
    // 创建群组
    confirmCreateGroup () {
      this.$refs.createGroupform.validate((valid) => {
        if (valid) {
          if (!this.fileList.length) {
            return this.$message.error('请上传群组二维码')
          }
          if (!this.$refs.uploadFile.isUploadAll()) {
            return this.$message.error('有附件正在上传中')
          }

          this.submitLoading = true
          const params = {
            anchorId: this.$route.query.anchorId,
            groupName: this.createGroup.groupName,
            groupImage: this.fileList[0].url
          }
          let groupResult = null
          if (this.dialogVisibleGroup.title === 1) {
            groupResult = this.$http.post('/sys/weixinfansgroup', params)
          } else {
            params.id = this.dialogVisibleGroup.id
            groupResult = this.$http.put('/sys/weixinfansgroup', params)
          }
          groupResult.then(({ data: res }) => {
            this.submitLoading = false
            if (res.code !== 0) return this.$message.error(res.msg)
            this.cancelCreateGroup()
            this.getfansGroupList()
            this.$message.success('您已提交企微粉丝群二维码，请等待审核')
          }).catch(err => {
            this.submitLoading = false
            console.error(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取粉丝等级
    // getFansLevels(type) {
    //   if(!type) return
    //   this.$http.get("/sys/sysfanslevel/getLevelList").then(({data: res}) => {
    //     if(res.code == 0) {
    //       this.fansLevelsOptions = res.data
    //     }else {
    //       this.fansLevelsOptions = []
    //       return this.$message.error(res.msg)
    //     }
    //   }).catch(err => {
    //     this.fansLevelsOptions = []
    //     this.$message.error(JSON.stringify(err))
    //   })
    // },
    // 重置
    reset (formName) {
      this.$refs[formName].resetFields()
      this.getfansGroupList()
    },
    // 添加成员
    // handleAddUser(i, row){
    //   this.groupId = row.id
    //   this.dialogVisibleAddUser = true
    //   this.getNoJoinFansUserList()
    // },
    // 显示、隐藏
    handleLookUser (i, row) {
      // this.groupId = row.id
      // this.currentGroupName = row.groupName
      // this.dialogVisibleLookUser = true
      // this.getHasJoinFansUserList()

      const msg = row.showStatus == 0 ? '确认显示该群组，显示后，用户在小程序可在小程序扫码加入该群组' : '确认隐藏该群组，隐藏后，用户在小程序将看不到该群组'

      this.$confirm(msg, row.showStatus == 0 ? '显示' : '隐藏', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put('/sys/weixinfansgroup/updateShowStatus', { id: row.id, showStatus: row.showStatus == 1 ? 0 : 1 }).then(res => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.query()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
    // 查看加入群的粉丝
    // getHasJoinFansUserList(){
    //   this.hasJoinFansUserForm.groupId = this.groupId
    //   this.$http.get('/sys/weixinfansgroup/getPeople',{params:this.$httpParams(this.hasJoinFansUserForm)}).then(({data:res})=>{
    //     // console.log(res)
    //     if (res.code !== 0) {
    //       this.hasJoinFansUserList = [];
    //       this.hasJoinFansUserTotal = 0;
    //       return this.$message.error(res.msg);
    //     }
    //     this.hasJoinFansUserList = res.data.list;
    //     this.hasJoinFansUserTotal = res.data.total;
    //   }).catch(err=>{
    //   })
    // },
    // 未加群的粉丝
    // getNoJoinFansUserList(){
    //   this.$http.get('/sys/weixinfansgroup/getAnchorFans',{params:this.$httpParams(this.noJoinFansUserForm)}).then(({data:res})=>{
    //     // console.log(res)
    //     if (res.code !== 0) {
    //       this.noJoinFansUserList = [];
    //       this.noJoinFansUserTotal = 0;
    //       return this.$message.error(res.msg);
    //     }
    //     this.noJoinFansUserList = res.data.list;
    //     this.noJoinFansUserTotal = res.data.total;
    //   }).catch(err=>{
    //   })
    // },
    // 添加进入群组
    // addUserJoinGroup(i,row){
    //   let userIds = [], data = {}

    //   if(!row) { //批量添加
    //     if(!this.dataListSelectionUsers.length) return this.$message.warning("请勾选要添加的成员")
    //     this.dataListSelectionUsers.forEach(item=>{
    //       userIds.push(item.weixinUserId)
    //     })
    //     data = {
    //       id:this.groupId,
    //       userIds,
    //     }
    //   }else { //单个添加
    //     data = {
    //       id:this.groupId,
    //       userIds: [row.weixinUserId],
    //     }
    //   }
    //   this.$http.post(`/sys/weixinfansgroup/addPeople`,data).then(({ data: res })=>{
    //     if (res.code !== 0) {
    //       return this.$message.error(res.msg);
    //     }
    //     this.$message({message:'添加成功',type:'success'})
    //     this.dialogVisibleAddUser = false
    //     this.getfansGroupList()
    //   }).catch(err=>{})
    // },
    // 移除群组成员
    // removeUserJoinGroup(i,row){
    //   let userIds = []
    //   userIds.push(row.weixinUserId)
    //   let data = {
    //     id:this.groupId,
    //     userIds,
    //   }
    //   this.$http.post(`/sys/weixinfansgroup/deletePeople`,data).then(({ data: res })=>{
    //     if (res.code !== 0) {
    //       return this.$message.error(res.msg);
    //     }
    //     this.$message({message:'移除成功',type:'success'})
    //     this.dialogVisibleLookUser = false
    //     this.getfansGroupList()
    //   }).catch(err=>{})
    // }
  }
}
</script>

<style lang="scss" scoped>
.fans_group{

}
</style>
