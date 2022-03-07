<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-gift__livegiftrecord">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="主键" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createBy" label="创建人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateDate" label="更新时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateBy" label="更新人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="delFlg" label="删除标记（0:未删除,1:已删除）" header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="礼物名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="icon" label="图标地址" header-align="center" align="center"></el-table-column>
        <el-table-column prop="dynamicIcon" label="动态图标" header-align="center" align="center"></el-table-column>
        <el-table-column prop="price" label="价格" header-align="center" align="center"></el-table-column>
        <el-table-column prop="isFree" label="是否免费（0 否，1 是）" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('gift:livegiftrecord:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('gift:livegiftrecord:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './livegiftrecord-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/live/gift/record/page',
        getDataListIsPage: true,
        exportURL: '/live/gift/record/export',
        deleteURL: '/live/gift/record',
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
  }
}
</script>
