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
        <el-form-item :label="$t('role.name')" prop="name">
          <el-input size="small" v-model="dataForm.name" :placeholder="$t('role.name')" clearable></el-input>
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
              <el-button size="mini" v-if="$hasPermission('sys:dict:save')" icon="el-icon-plus" plain type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
              <el-button size="mini" v-if="$hasPermission('sys:dict:delete')" icon="el-icon-delete" plain type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
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
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="name" :label="$t('role.name')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" :label="$t('role.remark')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" :label="$t('role.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('sys:role:update')" type="text" icon="el-icon-edit" size="mini" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('sys:role:delete')" type="text" icon="el-icon-delete" size="mini" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './role-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/role/page',
        getDataListIsPage: true,
        deleteURL: '/sys/role',
        deleteIsBatch: true
      },
      dataForm: {
        name: ''
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
