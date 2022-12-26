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
        <el-form-item label="计划名称" prop="planName">
          <el-input size="small" v-model="dataForm.planName" placeholder="计划名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="推送类型" prop="pushType">
          <el-select v-model="dataForm.pushType" placeholder="推送类型">
            <el-option label="站内信" value="1"></el-option>
            <el-option label="短信" value="2"></el-option>
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
              @click="resetDataForm('dataForm')">{{ $t("reset") }}</el-button>
          </el-form-item>
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
        <el-table-column prop="pushIcon" label="推送图标" header-align="center" align="center">
           <template slot-scope="scope">
              <img v-if="scope.row.pushIcon && scope.row.pushType == 1" style="width: 100%;" :src="scope.row.pushIcon" alt="">
              <div v-else></div>
          </template>
        </el-table-column>
        <el-table-column prop="planName" label="计划名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="configurationKey" label="配置KEY" header-align="center" align="center"></el-table-column>
        <el-table-column prop="pushType" label="推送类型" header-align="center" align="center">
          <template slot-scope="scope">
              {{scope.row.pushType === 1 ? '站内信' : '短信'}}
          </template>
        </el-table-column>
        <el-table-column prop="pushTitle" label="推送标题" header-align="center" align="center"></el-table-column>
        <el-table-column prop="pushContent" label="推送内容" show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope">
              <div v-html="scope.row.pushContent"></div>
          </template>
        </el-table-column>
        <el-table-column prop="dynamicGroupName" label="投放人群" header-align="center" align="center"></el-table-column>
        <el-table-column prop="isTiming" label="是否定时" header-align="center" align="center">
          <template slot-scope="scope">
              {{scope.row.isTiming === 1 ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column prop="timing" label="定时推送时间" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column prop="createDate" :label="$t('role.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
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
        getDataListURL: '/sys/syspush/page',
        getDataListIsPage: true
      },
      dataForm: {
        planName: '',
        pushType: ''
      }
    }
  },
  methods: {
    push (id) {
      this.$http.get(`/sys/syspush/push/${id}`).then(({ data: res }) => {
        console.log(res)
      })
    },
    operation (id, type) {
      this.$router.push({
        path: 'sys-message-push-add-or-update',
        query: {
          id: id,
          type: type
        }
      })
    }
  }
}
</script>
