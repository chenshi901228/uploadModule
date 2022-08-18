<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__log-operation">
      <el-form 
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        label-width="100px"
        @keyup.enter.native="getDataList"
      >
        <el-form-item :label="$t('logOperation.module')" prop="module">
          <el-input v-model="dataForm.module" :placeholder="$t('logOperation.module')" clearable></el-input>            
        </el-form-item>
        <el-form-item :label="$t('logOperation.status')" prop="status">
          <el-select v-model="dataForm.status" :placeholder="$t('logOperation.status')" clearable>
            <el-option :label="$t('logOperation.status0')" :value="0"></el-option>
            <el-option :label="$t('logOperation.status1')" :value="1"></el-option>
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
        v-loading="dataListLoading" 
        :data="dataList" 
        @sort-change="dataListSortChangeHandle" 
        :height="siteContentViewHeight"
        style="width: 100%;"
        ref="table">
        <el-table-column show-overflow-tooltip prop="creatorName" :label="$t('logOperation.creatorName')" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column show-overflow-tooltip prop="operation" :label="$t('logOperation.operation')" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column show-overflow-tooltip prop="module" :label="$t('logOperation.module')" header-align="center" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="requestUri" :label="$t('logOperation.requestUri')" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column show-overflow-tooltip prop="requestMethod" :label="$t('logOperation.requestMethod')" header-align="center" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="requestParams" :label="$t('logOperation.requestParams')" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column show-overflow-tooltip prop="requestTime" :label="$t('logOperation.requestTime')" sortable="custom" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            {{ `${scope.row.requestTime}ms` }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="status" :label="$t('logOperation.status')" sortable="custom" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="danger">{{ $t('logOperation.status0') }}</el-tag>
            <el-tag v-else size="small" type="success">{{ $t('logOperation.status1') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ip" :label="$t('logOperation.ip')" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column show-overflow-tooltip prop="userAgent" :label="$t('logOperation.userAgent')" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column show-overflow-tooltip prop="createDate" :label="$t('logOperation.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
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
        getDataListURL: '/sys/log/operation/page',
        getDataListIsPage: true,
        exportURL: '/sys/log/operation/export'
      },
      dataForm: {
        module: '',
        status: ''
      }
    }
  }
}
</script>
