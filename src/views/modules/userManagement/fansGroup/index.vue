<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="fans_group">
      <el-form
        size="small"
        :inline="true"
        :model="groupNameForm"
        @keyup.enter.native="getfansGroupList()"
        label-width="100px"
      >
        <el-row type="flex">
          <el-col :span="24">
            <el-form-item label="群组名称">
              <el-input
                v-model="groupNameForm.groupName"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="getfansGroupList">查询</el-button>
              <el-button size="small" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <el-row>
        <el-col>
          <el-button size="small" type="primary" @click="dialogVisibleGroup=true" style="marginBottom:10px;">创建群组</el-button>
        </el-col>
      </el-row> -->
      <el-table
        v-loading="dataUserListLoading"
        :data="fansGroupList"
        border
        fit
        style="width: 100%"
        max-height="500"
      >
        <template v-for="(label, prop) in diaTableTitle">
          <el-table-column
            :prop="prop"
            :label="label"
            :key="prop"
            header-align="center"
            align="center"
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
            <!-- <el-button
              size="mini"
              type="primary"
              @click="handleAddUser(scope.$index, scope.row)"
              >添加成员</el-button
            > -->
            <el-button
              size="mini"
              type="primary"
              @click="handleLookUser(scope.$index, scope.row)"
              >查看成员</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :current-page="groupNameForm.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="groupNameForm.limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle"
          @current-change="pageCurrentChangeHandle"
        >
      </el-pagination>
    </div>
    <!-- 创建群组弹窗 -->
    <el-dialog
      title="创建群组"
      :visible.sync="dialogVisibleGroup"
      width="30%"
      >
      <el-form ref="createGroupform" :model="createGroup" :rules="createGroupRules" label-width="80px">
        <el-form-item label="群组名称" prop="groupName">
          <el-input v-model="createGroup.groupName"></el-input>
        </el-form-item>
        <el-form-item style="textAlign:right;">
          <el-button @click="dialogVisibleGroup = false">取 消</el-button>
          <el-button type="primary" @click="confirmCreateGroup">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加成员弹窗 -->
    <el-dialog
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
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户昵称">
              <el-input v-model="noJoinFansUserForm.nickName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码">
              <el-input v-model="noJoinFansUserForm.phone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="等级">
              <el-input v-model="noJoinFansUserForm.level" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="粉丝团身份">
              <el-select v-model="noJoinFansUserForm.userType" placeholder="请选择" clearable>
                <el-option :value="0" label="普通用户"></el-option>
                <el-option :value="1" label="会长"></el-option>
                <el-option :value="2" label="副会长"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="float: right;">
              <el-button size="small" type="primary" @click="getNoJoinFansUserList">查询</el-button>
              <el-button size="small" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button size="small" type="primary" @click="dialogVisibleGroup=true" style="marginBottom:10px;">添加</el-button>
          </el-col>
        </el-row>
        <el-table
          v-loading="noJoinUserListLoading"
          :data="noJoinFansUserList"
          border
          fit
          @selection-change="noJoinUserSelectionChangeHandle"
          style="width: 100%"
          max-height="500"
        >
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
                type="primary"
                @click="addUserJoinGroup(scope.$index, scope.row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            :current-page="noJoinFansUserForm.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="noJoinFansUserForm.limit"
            :total="noJoinFansUserTotal"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="noJoinFansPageSizeChange"
            @current-change="noJoinFansCurrentChange"
          >
        </el-pagination>
      </el-form>
    </el-dialog>
    <!-- 查看成员弹窗 -->
    <el-dialog
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
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户昵称">
              <el-input v-model="hasJoinFansUserForm.nickName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码">
              <el-input v-model="hasJoinFansUserForm.phone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="等级">
              <el-input v-model="hasJoinFansUserForm.level" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="粉丝团身份">
              <el-select v-model="hasJoinFansUserForm.userType" placeholder="请选择" clearable>
                <el-option :value="0" label="普通用户"></el-option>
                <el-option :value="1" label="会长"></el-option>
                <el-option :value="2" label="副会长"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="float: right;">
              <el-button size="small" type="primary" @click="getHasJoinFansUserList">查询</el-button>
              <el-button size="small" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-table
          v-loading="hasJoinUserListLoading"
          :data="hasJoinFansUserList"
          border
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
          <!-- <el-table-column
            width="200"
            label="操作"
            fixed="right"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="removeUserJoinGroup(scope.$index, scope.row)"
                >移除</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination
            :current-page="hasJoinFansUserForm.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="hasJoinFansUserForm.limit"
            :total="hasJoinFansUserTotal"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="hasJoinFansPageSizeChange"
            @current-change="hasJoinFansCurrentChange"
          >
        </el-pagination>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data(){
    return{
      dialogVisibleGroup:false,//创建群组弹窗
      dialogVisibleAddUser:false,//添加成员弹窗
      dialogVisibleLookUser:false,//添加成员弹窗
      dataUserListLoading:false,
      noJoinUserListLoading:false,
      hasJoinUserListLoading:false,
      dataListSelectionUsers:[],
      groupNameForm:{
        userType:'',
        limit:10,
        page:1,
        anchorId:this.$route.query.anchorId,
      },
      diaTableTitle:{
        groupName:"群组名称",
        peopleNum:"用户人数",
        createDate:"创建时间",
      },
      total: 0,//群组条数
      fansGroupList:[],
      createGroup:{
        groupName:'',
      },
      createGroupRules:{
        groupName: [
          { required: true, message: "请输入群组名称", trigger: "blur" },
        ],
      },
      noJoinFansUserForm:{//未加入群组的粉丝团成员查询
        nickName:'',
        phone:'',
        level:'',
        userType:'',
        limit:10,
        page:1,
        anchorId:this.$route.query.anchorId,
      },
      noJoinFansUserList:[],
      noJoinFansUserTotal:0,//未加入群组的粉丝团成员总数
      noJoinColumns:{
        avatarUrl:"用户头像",
        nickName:"用户昵称",
        phone:"手机号码",
        level:"用户等级",
        userType:"粉丝团身份",
        createDate:"入群时间",
      },
      groupId:'',//群组ID
      hasJoinFansUserForm:{//未加入群组的粉丝团成员查询
        groupId:'',
        nickName:'',
        phone:'',
        level:'',
        userType:'',
        limit:10,
        page:1,
      },
      hasJoinFansUserList:[],
      hasJoinFansUserTotal:0,//未加入群组的粉丝团成员总数
      hasJoinColumns:{
        avatarUrl:"用户头像",
        nickName:"用户昵称",
        phone:"手机号码",
        level:"用户等级",
        userType:"粉丝团身份",
        createDate:"入群时间",
      },
    }
  },
  created(){
    this.getfansGroupList()
  },
  methods:{
    //批量选择
    noJoinUserSelectionChangeHandle(val) {
      this.dataListSelectionUsers = val;
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      this.groupNameForm.page = 1;
      this.groupNameForm.limit = val;
      this.getfansGroupList();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      this.groupNameForm.page = val;
      this.getfansGroupList();
    },
    //未加入群组的粉丝列表分页
    noJoinFansPageSizeChange(val){
      this.noJoinFansUserForm.page = 1;
      this.noJoinFansUserForm.limit = val;
      this.getNoJoinFansUserList();
    },
    //未加入群组的粉丝列表分页
    noJoinFansCurrentChange(val){
      this.noJoinFansUserForm.page = val;
      this.getNoJoinFansUserList();
    },
    //已经加入群组的粉丝列表分页
    hasJoinFansPageSizeChange(val){
      this.hasJoinFansUserForm.page = 1;
      this.hasJoinFansUserForm.limit = val;
      this.getHasJoinFansUserList();
    },
    //已经加入群组的粉丝列表分页
    hasJoinFansCurrentChange(val){
      this.hasJoinFansUserForm.page = val;
      this.getHasJoinFansUserList();
    },
    //获取群组列表
    getfansGroupList(){
      this.dataListLoading = true;
      this.$http.get('/sys/weixinfansgroup/page', {params:this.groupNameForm}).then(({ data: res }) => {
        this.dataListLoading = false;
        if (res.code !== 0) {
          this.fansGroupList = [];
          this.total = 0;
          return this.$message.error(res.msg);
        }
        this.fansGroupList = res.data.list;
        this.total = res.data.total;
      }).catch(err=>{
        this.dataListLoading = false;
      })
    },
    //创建群组
    confirmCreateGroup(){
      this.$refs.createGroupform.validate((valid) => {
        if (valid) {
          this.$http.post('/sys/weixinfansgroup',{anchorId: this.$route.query.anchorId,groupName:this.createGroup.groupName}).then(({ data: res })=>{
            if (res.code !== 0) {
              return this.$message.error(res.msg);
            }
            this.getfansGroupList()
            this.dialogVisibleGroup = false
          }).catch(err=>{})
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //重置
    reset(){
      this.groupNameForm.groupName = ''
      this.hasJoinFansUserForm.nickName = ''
      this.hasJoinFansUserForm.phone = ''
      this.hasJoinFansUserForm.level = ''
      this.hasJoinFansUserForm.userType = ''
      this.noJoinFansUserForm.nickName = ''
      this.noJoinFansUserForm.phone = ''
      this.noJoinFansUserForm.level = ''
      this.noJoinFansUserForm.userType = ''
    },
    //添加成员
    handleAddUser(i, row){
      this.groupId = row.id
      this.dialogVisibleAddUser = true
      this.getNoJoinFansUserList()
    },
    //查看成员
    handleLookUser(i, row){
      this.groupId = row.id
      this.dialogVisibleLookUser = true
      this.getHasJoinFansUserList()
    },
    //查看加入群的粉丝
    getHasJoinFansUserList(){
      this.hasJoinFansUserForm.groupId = this.groupId
      this.$http.get('/sys/weixinfansgroup/getPeople',{params:this.hasJoinFansUserForm}).then(({data:res})=>{
        console.log(res)
        if (res.code !== 0) {
          this.hasJoinFansUserList = [];
          this.hasJoinFansUserTotal = 0;
          return this.$message.error(res.msg);
        }
        this.hasJoinFansUserList = res.data.list;
        this.hasJoinFansUserTotal = res.data.total;
      }).catch(err=>{
      })
    },
    //未加群的粉丝
    getNoJoinFansUserList(){
      this.$http.get('/sys/weixinfansgroup/getAnchorFans',{params:this.noJoinFansUserForm}).then(({data:res})=>{
        console.log(res)
        if (res.code !== 0) {
          this.noJoinFansUserList = [];
          this.noJoinFansUserTotal = 0;
          return this.$message.error(res.msg);
        }
        this.noJoinFansUserList = res.data.list;
        this.noJoinFansUserTotal = res.data.total;
      }).catch(err=>{
      })
    },
    //添加进入群组
    addUserJoinGroup(i,row){
      let userIds = []
      userIds.push(row.weixinUserId)
      let data = {
        id:this.groupId,
        userIds,
      }
      this.$http.post(`/sys/weixinfansgroup/addPeople`,data).then(({ data: res })=>{
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.$message({message:'添加成功',type:'success'})
        this.dialogVisibleAddUser = false
        this.getfansGroupList()
      }).catch(err=>{})
    },
    //移除群组成员
    removeUserJoinGroup(i,row){
      let userIds = []
      userIds.push(row.weixinUserId)
      let data = {
        id:this.groupId,
        userIds,
      }
      this.$http.post(`/sys/weixinfansgroup/deletePeople`,data).then(({ data: res })=>{
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.$message({message:'移除成功',type:'success'})
        this.dialogVisibleLookUser = false
        this.getfansGroupList()
      }).catch(err=>{})
    }
  }
}
</script>

<style lang="scss" scoped>
.fans_group{

}
</style>