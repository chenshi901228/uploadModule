<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-job__schedule">
      <el-form 
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        label-width="100px"
        @keyup.enter.native="getDataList()">
        <el-form-item :label="$t('schedule.beanName')" prop="beanName">
          <el-input 
            style="width: 200px"
            v-model="dataForm.beanName" 
            :placeholder="$t('schedule.beanName')" 
            clearable></el-input>
        </el-form-item>
        <!-- 搜索重置展开按钮 -->
        <div class="headerTool-search-btns">
          <el-form-item>
            <el-button 
              type="primary" 
              icon="el-icon-search" 
              size="mini"
              @click="getDataList">{{ $t("query") }}</el-button>
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
                v-if="$hasPermission('sys:schedule:save')" 
                type="primary"
                icon="el-icon-plus" 
                @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
              <el-button
                size="mini"
                v-if="$hasPermission('sys:schedule:delete')" 
                type="danger" 
                icon="el-icon-delete"
                @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
              <el-button
                size="mini"
                v-if="$hasPermission('sys:schedule:pause')" 
                type="danger" 
                icon="el-icon-video-pause"
                @click="pauseHandle()">{{ $t('schedule.pauseBatch') }}</el-button>
              <el-button
                size="mini"
                v-if="$hasPermission('sys:schedule:resume')" 
                type="danger" 
                icon="el-icon-refresh-left"
                @click="resumeHandle()">{{ $t('schedule.resumeBatch') }}</el-button>
              <el-button
                size="mini"
                v-if="$hasPermission('sys:schedule:run')" 
                type="danger" 
                icon="el-icon-play"
                @click="runHandle()">{{ $t('schedule.runBatch') }}</el-button>
              <el-button
                size="mini"
                v-if="$hasPermission('sys:schedule:log')" 
                type="success"
                icon="el-icon-document" 
                @click="logHandle()">{{ $t('schedule.log') }}</el-button>

              <!-- <el-button 
                type="warning"
                plain
                icon="el-icon-download" 
                size="mini"
                @click="exportHandle">{{ $t("export") }}</el-button> -->
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
        ref="table"
        v-loading="dataListLoading"
        :data="dataList"
        :height="siteContentViewHeight"
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="beanName" :label="$t('schedule.beanName')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="params" :label="$t('schedule.params')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="cronExpression" :label="$t('schedule.cronExpression')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" :label="$t('schedule.remark')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="status" :label="$t('schedule.status')" sortable="custom" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" size="small">{{ $t('schedule.status1') }}</el-tag>
            <el-tag v-else size="small" type="danger">{{ $t('schedule.status0') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('sys:schedule:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('sys:schedule:pause')" type="text" size="small" @click="pauseHandle(scope.row.id)">{{ $t('schedule.pause') }}</el-button>
            <el-button v-if="$hasPermission('sys:schedule:resume')" type="text" size="small" @click="resumeHandle(scope.row.id)">{{ $t('schedule.resume') }}</el-button>
            <el-button v-if="$hasPermission('sys:schedule:run')" type="text" size="small" @click="runHandle(scope.row.id)">{{ $t('schedule.run') }}</el-button>
            <el-button v-if="$hasPermission('sys:schedule:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <!-- 弹窗, 日志列表 -->
      <log v-if="logVisible" ref="log"></log>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './schedule-add-or-update'
import Log from './schedule-log'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/job/schedule/page',
        getDataListIsPage: true,
        deleteURL: '/job/schedule',
        deleteIsBatch: true
      },
      dataForm: {
        beanName: ''
      },
      logVisible: false
    }
  },
  components: {
    AddOrUpdate,
    Log
  },
  methods: {
    // 暂停
    pauseHandle (id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('schedule.pause') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.put('/job/schedule/pause', id ? [id] : this.dataListSelections.map(item => item.id)).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 恢复
    resumeHandle (id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('schedule.resume') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.put('/job/schedule/resume', id ? [id] : this.dataListSelections.map(item => item.id)).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 执行
    runHandle (id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('schedule.run') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.put('/job/schedule/run', id ? [id] : this.dataListSelections.map(item => item.id)).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 日志列表
    logHandle () {
      this.logVisible = true
      this.$nextTick(() => {
        this.$refs.log.init()
      })
    }
  }
}
</script>
