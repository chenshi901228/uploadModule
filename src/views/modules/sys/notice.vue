<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__sysnotice">
      <el-form 
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="getDataList"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('notice.type')" prop="type">
              <ren-select v-model="dataForm.type" dict-type="notice_type" :placeholder="$t('notice.type')"></ren-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="float:right; padding-right:10px">          
              <el-button size="small" v-if="$hasPermission('sys:dict:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
              <el-button size="small" v-if="$hasPermission('sys:dict:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
              <el-button size="small" type="primary" @click="getDataList">{{ $t("query") }}</el-button>
              <el-button size="small" @click="resetDataForm()">{{ $t("reset") }}</el-button>
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
        <div v-if="isOpen">
        </div>
      </el-form>
      <el-table 
        v-loading="dataListLoading" 
        :data="dataList" 
        border 
        @selection-change="dataListSelectionChangeHandle" 
        :height="siteContentViewHeight"
        style="width: 100%;"
        ref="table">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="title" :label="$t('notice.title')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="type" :label="$t('notice.type')" header-align="center" align="center" width="150">
          <template slot-scope="scope">
              {{ $getDictLabel("notice_type", scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="senderName" :label="$t('notice.senderName')" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column prop="senderDate" :label="$t('notice.senderDate')" header-align="center" align="center" width="170"></el-table-column>
        <el-table-column prop="status" :label="$t('notice.status')" header-align="center" align="center" width="130">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" size="small" type="danger">{{ $t('notice.status0') }}</el-tag>
              <el-tag v-else size="small" type="success">{{ $t('notice.status1') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="scope.row.status === 1" type="text" size="small" @click="viewHandle(scope.row)">{{ $t('notice.view') }}</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './notice-add-or-update'
import { addDynamicRoute } from '@/router'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/notice/page',
        getDataListIsPage: true,
        deleteURL: '/sys/notice',
        deleteIsBatch: true
      },
      dataForm: {
        type: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    viewHandle (row) {
      // 路由参数
      const routeParams = {
        routeName: `${this.$route.name}__${row.id}`,
        title: this.$t('notice.view1'),
        path: 'sys/notice-view',
        params: {
          id: row.id
        }
      }
      // 动态路由
      addDynamicRoute(routeParams, this.$router)
    }
  }
}
</script>
