<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-datasource">
      <el-form 
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="getDataList"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="连接名" prop="connName">
              <el-input size="small" v-model="dataForm.connName" placeholder="连接名" clearable></el-input>
            </el-form-item>
            <el-form-item label="数据库类型" prop="dbType">
              <el-select size="small" v-model="dataForm.dbType" clearable placeholder="数据库类型" class="w-percent-100">
                <el-option value="MySQL" label="MySQL"></el-option>
                <el-option value="Oracle" label="Oracle"></el-option>
                <el-option value="SQLServer" label="SQLServer"></el-option>
                <el-option value="PostgreSQL" label="PostgreSQL"></el-option>
              </el-select>
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
        <el-table-column prop="connName" label="连接名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="dbType" label="数据库类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="connUrl" label="数据库URL" header-align="center" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="password" label="密码" header-align="center" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" sortable="custom" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="success">启用</el-tag>
            <el-tag v-else size="small" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="datasourceHandle(scope.row.id)">连接测试</el-button>
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
import AddOrUpdate from './datasource-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/devtools/datasource/page',
        getDataListIsPage: true,
        deleteURL: '/devtools/datasource',
        deleteIsBatch: true
      },
      dataForm: {
        connName: '',
        dbType: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    datasourceHandle: function (id) {
      this.$http.get('/devtools/datasource/test/' + id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          return this.$message.success(res.data)
        }
      }).catch(() => {})
    }
  }
}
</script>
