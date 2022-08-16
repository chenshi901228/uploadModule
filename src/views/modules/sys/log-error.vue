<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__log-error">
      <el-form 
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        label-width="100px"
        @keyup.enter.native="getDataList"
      >
        <el-form-item :label="$t('logError.module')" prop="module">
          <el-input v-model="dataForm.module" :placeholder="$t('logError.module')" clearable></el-input>          
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
        <el-table-column prop="module" :label="$t('logError.module')" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="requestUri" :label="$t('logError.requestUri')" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="requestMethod" :label="$t('logError.requestMethod')" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="requestParams" :label="$t('logError.requestParams')" header-align="center" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ip" :label="$t('logError.ip')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userAgent" :label="$t('logError.userAgent')" header-align="center" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" :label="$t('logError.createDate')" sortable="custom" header-align="center" align="center" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button icon="el-icon-position" type="text" size="small" @click="infoHandle(scope.row.errorInfo)">{{ $t('logError.errorInfo') }}</el-button>
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
        getDataListURL: '/sys/log/error/page',
        getDataListIsPage: true,
        exportURL: '/sys/log/error/export'
      },
      dataForm: {
        module: ''
      }
    }
  },
  methods: {
    // 异常信息
    infoHandle (info) {
      this.$alert(info, this.$t('logError.errorInfo'), {
        customClass: 'mod-sys__log-error-view-info'
      })
    }
  }
}
</script>

<style lang="scss">
.mod-sys__log-error {
  &-view-info {
    width: 80%;
    .el-message-box__content {
      overflow-y: scroll;
      max-height: 70vh;
      margin: 20px 0;
    }
  }
}
</style>
