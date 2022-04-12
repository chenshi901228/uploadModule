<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__post">
      <el-form 
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="getDataList"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('post.postCode')" prop="postCode">
              <el-input size="small" v-model="dataForm.postCode" :placeholder="$t('post.postCode')" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('post.postName')" prop="postName">
              <el-input size="small" v-model="dataForm.postName" :placeholder="$t('post.postName')" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="float:right; padding-right:10px">          
              <el-button size="small" v-if="$hasPermission('sys:dict:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
              <el-button size="small" v-if="$hasPermission('sys:dict:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
              <el-button size="small" type="primary" @click="getDataList">{{ $t("query") }}</el-button>
              <el-button size="small" @click="resetDataForm()">{{ $t("reset") }}</el-button>
              <el-button 
                  size="small" 
                  type="primary"
                  @click="open"
              >
                  {{ isOpen ? "收起" : "展开"}}<i style="margin-left:10px" :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="isOpen">
          <el-row>
            <el-col :span="6">
              <el-form-item :label="$t('post.status')" prop="status">
                <ren-select v-model="dataForm.status" dict-type="post_status" :placeholder="$t('post.status')" ></ren-select>
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
        ref="table" 
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="postCode" :label="$t('post.postCode')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="postName" :label="$t('post.postName')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="sort" :label="$t('post.sort')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="status" :label="$t('post.status')" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel("post_status", scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('sys:post:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('sys:post:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './post-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/post/page',
        getDataListIsPage: true,
        deleteURL: '/sys/post',
        deleteIsBatch: true
      },
      dataForm: {
        postCode: '',
        postName: '',
        status: '',
      }
    }
  },
  watch: {
  },
  components: {
    AddOrUpdate
  }
}
</script>
