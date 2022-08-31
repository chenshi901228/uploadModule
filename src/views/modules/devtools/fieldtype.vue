<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-fieldtype">
      <el-form 
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="getDataList"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="字段类型" prop="columnType">
              <el-input size="small" v-model="dataForm.columnType" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="属性类型" prop="attrType">
              <el-input size="small" v-model="dataForm.attrType" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="float:right; padding-right:10px">     
              <el-button size="small" type="primary" @click="addOrUpdateHandle()">新增</el-button>
              <el-button size="small" type="danger" @click="deleteHandle()">删除</el-button>
              <!-- <el-button size="small" type="info" @click="exportHandle()">{{ $t('export') }}</el-button>      -->
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
        <div v-show="isOpen">
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
        <el-table-column prop="columnType" label="字段类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="attrType" label="属性类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="packageName" label="属性包名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
import AddOrUpdate from './fieldtype-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/devtools/fieldtype/page',
        getDataListIsPage: true,
        deleteURL: '/devtools/fieldtype',
        deleteIsBatch: true
      },
      dataForm: {
        columnType: '',
        attrType: '',
        packageName: ''
      }
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
