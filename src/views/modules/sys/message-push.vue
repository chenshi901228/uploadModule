<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__role">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        label-width="100px"
        label-position="right"
        @keyup.enter.native="getDataList"
      >
        <el-form-item label="计划名称" prop="planName">
          <el-input size="small" v-model="dataForm.planName" placeholder="计划名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="推送类型" prop="pushType">
          <el-select v-model="dataForm.pushType" placeholder="推送类型">
            <el-option label="站内信" value="1"></el-option>
            <el-option label="短信" value="2"></el-option>
          </el-select>
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
              @click="resetDataForm('dataForm')">{{ $t("reset") }}</el-button>
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <el-button size="mini" v-if="$hasPermission('sys:dict:save')" icon="el-icon-plus" plain type="primary" @click="operation('',3)">新增推送计划</el-button>
              <el-button size="mini" v-if="$hasPermission('sys:dict:save')" plain type="primary" @click="$router.push('sys-message-push-log')">推送日志</el-button>
            </el-form-item>
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="mini" icon="el-icon-refresh" circle @click="query"></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
        <div v-show="isOpen">
        </div>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        :height="siteContentViewHeight"
        style="width: 100%;"
        ref="table">
        <el-table-column show-overflow-tooltip prop="pushIcon" label="推送图标" header-align="center" align="center">
           <template slot-scope="scope">
              <img    style="width: 100%;" :src="scope.row.pushIcon" alt="">
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="planName" label="计划名称" header-align="center" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="configurationKey" label="配置KEY" header-align="center" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="pushType" label="推送类型" header-align="center" align="center">
          <template slot-scope="scope">
              {{scope.row.pushType === "1" ? '站内信' : '短信'}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="pushTitle" label="推送标题" header-align="center" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="pushContent" label="推送内容" header-align="center" align="center">
          <template slot-scope="scope">
              <div v-html="scope.row.pushContent"></div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="dynamicGroupName" label="投放人群" header-align="center" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="isTiming" label="是否定时" header-align="center" align="center">
          <template slot-scope="scope">
              {{scope.row.isTiming === 1 ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="timing" label="定时推送时间" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column show-overflow-tooltip prop="createDate" :label="$t('role.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button  type="text" icon="el-icon-document" size="mini" @click="operation(scope.row.id,1)">查看详情</el-button>
            <el-button  type="text" icon="el-icon-edit" size="mini" @click="operation(scope.row.id,2)">编辑</el-button>
           <el-button  type="text" icon="el-icon-s-promotion" size="mini" @click="push(scope.row.id)">推送</el-button>
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
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/syspush/page',
        getDataListIsPage: true
      },
      dataForm: {
        planName: '',
        pushType: ''
      }
    }
  },
  methods: {
    push (id) {
      this.$message.success('消息推送成功')
      this.$http.get(`/sys/syspush/push/${id}`).then(({ data: res }) => {
        // if (res.success) {
        //   this.$message.success('消息推送成功')
        // }
      })
    },
    operation (id, type) {
      this.$router.push({
        path: 'sys-message-push-add-or-update',
        query: {
          id: id,
          type: type
        }
      })
    }
  }
}
</script>
