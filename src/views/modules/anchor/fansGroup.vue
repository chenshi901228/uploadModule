<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="fans_group">
      <el-form
        class="headerTool"
        size="small"
        :inline="true"
        :model="groupNameForm"
        @keyup.enter.native="getfansGroupList()"
        label-width="100px"
      >
      <el-form-item label="真实姓名">
          <el-input
            clearable
            style="width: 200px"
            v-model="groupNameForm.realName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            clearable
            style="width: 200px"
            v-model="groupNameForm.phone"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="主播昵称">
          <el-input
            clearable
            style="width: 200px"
            v-model="groupNameForm.anchorName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="groupNameForm.status" placeholder="请选择审核状态">
            <el-option label="已通过" value="1"></el-option>
            <el-option label="已驳回" value="-1"></el-option>
            <el-option label="审核中" value="0"></el-option>
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
              @click="reset('main')">{{ $t("reset") }}</el-button>
            <!-- <el-button size="mini" plain @click="open">
              <i :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button> -->
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="small" icon="el-icon-refresh" circle @click="pageCurrentChangeHandle(1)"></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-table
        v-loading="dataUserListLoading"
        :data="fansGroupList"
        fit
        style="width: 100%"
        :height="siteContentViewHeight"
      >
      <el-table-column
      label="序号"
      type="index"
      >
      </el-table-column>
      <el-table-column
            prop="realName"
            label="真实姓名"
            header-align="center"
            align="center"
          >
        </el-table-column>
        <el-table-column
            prop="phone"
            label="手机号码"
            header-align="center"
            align="center"
          >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
            prop="anchorName"
            label="主播昵称"
            header-align="center"
            align="center"
          >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
            prop="groupName"
            label="群组名"
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
              <span v-else-if="prop=='showStatus'">
                {{row.delFlg==1?'隐藏':'显示'}}
              </span>
              <span v-else-if="prop=='status'">
                {{row.status==1?'已通过': row.status== -1 ? '已驳回' : '审核中'}}
              </span>
              <span v-else>
                {{ row[prop] || '-' }}
              </span>
            </template>
          </el-table-column>
        </template>
        <el-table-column
            show-overflow-tooltip
            prop="updateDate"
            label="提交时间"
            header-align="center"
            align="center"
          >
        </el-table-column>
        <el-table-column
            show-overflow-tooltip
            prop="auditDate"
            label="审核时间"
            header-align="center"
            align="center"
          >
          <template slot-scope="{row}">
            {{row.status === 0 ? '-' : row.auditDate}}
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="操作"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleLook(scope.$index, scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
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
    <el-dialog
      title="二维码"
      :visible.sync="previewImgDia"
      width="30%"
      >
      <div style="textAlign:center">
        <img style="maxWidth:100%;" :src="previewImgUrl" alt="">
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import mixinTableModule from '@/mixins/table-module'
export default {
  mixins: [mixinTableModule],
  data () {
    return {
      previewImgDia: false, // 二维码预览弹窗
      previewImgUrl: '',
      dataUserListLoading: false,
      hasJoinUserListLoading: false,
      dataListSelectionUsers: [],
      groupNameForm: {
        realName: '',
        limit: 10,
        page: 1,
        anchorId: '',
        phone: '',
        anchorName: '',
        status: ''
      },
      diaTableTitle: {
        // realName: '真实姓名',
        // phone: '手机号码',
        // anchorName: '主播昵称',
        // groupName: '群组名',
        groupImage: '群组二维码',
        // updateDate: '提交时间',
        // auditDate: '审批时间',
        status: '审核状态'
      },
      total: 0, // 群组条数
      fansGroupList: [],
      groupId: '', // 群组ID
      fansLevelsOptions: [], // 粉丝等级options
      currentGroupName: '' // 当前查看的群组
    }
  },
  activated () {
    this.groupNameForm.anchorId = this.$route.query.anchorId
    this.getfansGroupList()
  },
  methods: {
    previewImg (url) { // 预览
      if (url) {
        this.previewImgUrl = url
        this.previewImgDia = true
      }
    },
    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.groupNameForm.page = 1
      this.groupNameForm.limit = val
      this.getfansGroupList()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.groupNameForm.page = val
      this.getfansGroupList()
    },
    // 获取群组列表
    getfansGroupList () {
      this.dataListLoading = true
      this.$http.get('/sys/weixinfansgroup/pageWithManage', { params: this.groupNameForm }).then(({ data: res }) => {
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
    // 重置
    reset (formName) {
      this.groupNameForm.realName = ''
      this.groupNameForm.phone = ''
      this.groupNameForm.anchorName = ''
      this.groupNameForm.status = ''
      this.groupNameForm.limit = 10
      this.groupNameForm.page = 1
      if (formName == 'main') this.getfansGroupList()
    },
    // 查看成员
    handleLook (i, row) {
      this.groupId = row.id
      this.currentGroupName = row.groupName
      this.$router.push({
        path: '/anchor-approvalDetail'
      })
      window.localStorage.setItem(
        'anchor-approvalDetail',
        JSON.stringify(row)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.fans_group{

}
</style>
