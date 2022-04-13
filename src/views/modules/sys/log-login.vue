<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__log-login">
      <el-form 
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="getDataList"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('logLogin.creatorName')" prop="creatorName">
              <el-input size="small" v-model="dataForm.creatorName" :placeholder="$t('logLogin.creatorName')" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="float:right; padding-right:10px">     
              <el-button size="small" type="info" @click="exportHandle()">{{ $t('export') }}</el-button>     
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
        @sort-change="dataListSortChangeHandle" 
        :height="siteContentViewHeight"
        style="width: 100%;"
        ref="table">
        <el-table-column prop="creatorName" :label="$t('logLogin.creatorName')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="operation" :label="$t('logLogin.operation')" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.operation === 0 ? $t('logLogin.operation0') : $t('logLogin.operation1') }}
          </template>
        </el-table-column>
        <el-table-column prop="ip" :label="$t('logLogin.ip')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userAgent" :label="$t('logLogin.userAgent')" header-align="center" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createDate" :label="$t('logLogin.createDate')" sortable="custom" header-align="center" align="center"></el-table-column>
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
        getDataListURL: '/sys/log/login/page',
        getDataListIsPage: true,
        exportURL: '/sys/log/login/export'
      },
      dataForm: {
        creatorName: ''
      }
    }
  }
}
</script>
