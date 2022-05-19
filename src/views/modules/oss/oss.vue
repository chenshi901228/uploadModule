<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-oss__oss">
      <el-form  class="headerTool" :inline="true" :model="dataForm">
        <el-form-item>
          <el-button size="mini" plain type="warning" icon="el-icon-edit" @click="configHandle()">{{ $t('oss.config') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" plain type="primary" icon="el-icon-plus" @click="uploadHandle()">{{ $t('oss.upload') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        :height="siteContentViewHeight"
        style="width: 100%;"
        ref="table">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="url" :label="$t('oss.url')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" :label="$t('oss.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <!-- 弹窗, 云存储配置 -->
      <config v-if="configVisible" ref="config"></config>
      <!-- 弹窗, 上传文件 -->
      <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"></upload>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import Config from './oss-config'
import Upload from './oss-upload'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/oss/file/page',
        getDataListIsPage: true,
        deleteURL: '/oss/file',
        deleteIsBatch: true
      },
      dataForm: {},
      configVisible: false,
      uploadVisible: false
    }
  },
  components: {
    Config,
    Upload
  },
  methods: {
    // 云存储配置
    configHandle () {
      this.configVisible = true
      this.$nextTick(() => {
        this.$refs.config.init()
      })
    },
    // 上传文件
    uploadHandle () {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.upload.init()
      })
    }
  }
}
</script>
