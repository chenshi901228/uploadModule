<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-weixin__sysanchorinfo">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="getDataList()"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="主播昵称" prop="username">
              <el-input
                size="small"
                v-model="dataForm.username"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="username">
              <el-input
                size="small"
                v-model="dataForm.username"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="float: right; padding-right: 10px">
              <el-button type="info" size="small" @click="exportHandle()">{{
                $t("export")
              }}</el-button>
              <el-button size="small" type="primary" @click="getDataList()">{{
                $t("query")
              }}</el-button>
              <el-button size="small" @click="resetDataForm()">{{
                $t("reset")
              }}</el-button>
              <el-button size="small" type="primary" @click="open">
                {{ isOpen ? "收起" : "展开"
                }}<i
                  style="margin-left: 10px"
                  :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                ></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <div v-if="isOpen">
          <el-row>
            <el-col :span="6">
              <el-form-item label="手机号码" prop="phone">
                <el-input
                  size="small"
                  v-model="dataForm.phone"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
        
            <el-col :span="6">
              <el-form-item label="身份证号" prop="username">
                 <el-input
                  size="small"
                  v-model="dataForm.username"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别" prop="gender">
                <el-select
                  size="small"
                  v-model="dataForm.gender"
                  clearable
                >
                  <el-option :value="0" label="男"></el-option>
                  <el-option :value="1" label="女"></el-option>
                  <el-option :value="2" label="保密"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="审批状态" prop="status">
                <el-select
                  size="small"
                  v-model="dataForm.status"
                  clearable
                >
                  <el-option :value="0" label="待处理"></el-option>
                  <el-option :value="1" label="同意"></el-option>
                  <el-option :value="-1" label="拒绝"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <el-table 
        v-loading="dataListLoading" 
        :data="dataList" 
        border 
        @selection-change="dataListSelectionChangeHandle" 
        :height="siteContentViewHeight"
        style="width: 100%"
        ref="table"
      >
        <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="weixinUserId" label="主播ID" header-align="center" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="avatarUrl" label="头像" header-align="center" align="center">
           <template slot-scope="scope">
             <img :src="scope.row.avatarUrl" style="width:100px;height:100px;">
          </template>
        </el-table-column>
        <el-table-column prop="backgroundImage" label="背景图" header-align="center" align="center">
           <template slot-scope="scope">
             <img :src="scope.row.backgroundImage" style="width:100px;height:100px;">
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" header-align="center" align="center">
          <template slot-scope="scope">
             <el-tag v-if="scope.row.status === 0" type="info">男</el-tag>
             <el-tag v-if="scope.row.status === 1" type="info">女</el-tag>
             <el-tag v-if="scope.row.status === 2" type="info">保密</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="introduce" label="介绍" header-align="center" align="center"></el-table-column>
        <el-table-column prop="legalizeFlg" label="认证用户" header-align="center" align="center">
          <template slot-scope="scope">
             {{ scope.row.legalizeFlg === 1 ? '认证' : '未认证' }}
          </template>
        </el-table-column>
        <el-table-column prop="tutorFlg" label="是否导师" header-align="center" align="center">
          <template slot-scope="scope">
             {{ scope.row.tutorFlg === 1 ? '认证' : '未认证' }}
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="申请时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateDate" label="操作时间" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? '' : scope.row.updateDate }}
          </template>
        </el-table-column> -->

        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="avatarUrl" label="主播头像" header-align="center" align="center" width="100">
           <template slot-scope="scope">
             <img :src="scope.row.avatarUrl||'https://zego-live-video-back.oss-cn-beijing.aliyuncs.com/liveImages/default_avatar.png'" style="width:60px;height:60px;">
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="username" label="主播昵称" header-align="center" align="center"></el-table-column> 
        <el-table-column show-overflow-tooltip prop="username" label="真实姓名" header-align="center" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="phone" label="手机号码" header-align="center" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="username" label="身份证号" header-align="center" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="gender" label="性别" header-align="center" align="center">
          <template slot-scope="scope">
             <el-tag v-if="scope.row.status === 0" type="info">男</el-tag>
             <el-tag v-if="scope.row.status === 1" type="info">女</el-tag>
             <el-tag v-if="scope.row.status === 2" type="info">保密</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="introduce" label="主播介绍" header-align="center" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="legalizeFlg" label="是否认证" header-align="center" align="center">
          <template slot-scope="scope">
             {{ scope.row.legalizeFlg === 1 ? '认证' : '未认证' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="tutorFlg" label="是否是指导师" header-align="center" align="center" width="120">
          <template slot-scope="scope">
             {{ scope.row.tutorFlg === 1 ? '认证' : '未认证' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="createDate" label="申请时间" header-align="center" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="updateDate" label="审批时间" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? '' : scope.row.updateDate }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="status" label="状态" header-align="center" align="center">
          <template slot-scope="scope">
             <el-tag v-if="scope.row.status === 0" type="info">待处理</el-tag>
             <el-tag v-if="scope.row.status === 1" type="success">同意</el-tag>
             <el-tag v-if="scope.row.status === -1" type="danger">拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0" type="text" size="small" @click="updateApplyInfoStatus(scope.row.id, 1)">同意</el-button>
            <el-button v-if="scope.row.status === 0" type="text" size="small" @click="updateApplyInfoStatus(scope.row.id, -1)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './sysanchorinfo-add-or-update'
import debounce from 'lodash/debounce'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/anchor/applyInfo/addPage',
        getDataListIsPage: true,
        exportURL: '/sys/anchor/info/export',
        deleteURL: '/sys/anchor/info',
        deleteIsBatch: true
      },
      dataForm: {
      }
    }
  },
  watch: {
  },
  components: {
    AddOrUpdate
  },
  methods: {
    // 是否同意
    updateApplyInfoStatus: debounce(function (id, status) {
      this.$confirm(`是否执行 [${status == -1 ? '拒绝' : '同意'}[ 操作`, this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http['put']('/sys/anchor/applyInfo/', {
          id,
          status
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.query();
            }
          })
        }).catch(() => {})
      }).catch(() => {});
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
