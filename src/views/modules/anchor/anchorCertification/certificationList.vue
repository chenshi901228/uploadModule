<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-weixin__sysanchorinfo">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        label-width="100px"
        @keyup.enter.native="getDataList"
      >
        <el-form-item
          v-show="isOpen || formItemCount >= 1"
          label="真实姓名"
          prop="realName"
        >
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.realName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="isOpen || formItemCount >= 2"
          label="手机号码"
          prop="phone"
        >
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.phone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="isOpen || formItemCount >= 3"
          label="身份证号"
          prop="idCard"
        >
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.idCard"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          v-show="isOpen || formItemCount >= 5"
          label="主播昵称"
          prop="username"
        >
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.username"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="isOpen || formItemCount >= 6"
          label="认证类型"
          prop="userType"
        >
          <el-select
            style="width: 200px"
            placeholder="请选择"
            v-model="dataForm.userType"
            clearable
          >
            <el-option :value="1" label="个人"></el-option>
            <el-option :value="2" label="企业"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-show="isOpen || formItemCount >= 8"
          label="审批状态"
          prop="status"
        >
          <el-select
            style="width: 200px"
            placeholder="请选择"
            v-model="dataForm.status"
            clearable
          >
            <el-option :value="0" label="待审批"></el-option>
            <el-option :value="1" label="已通过"></el-option>
            <el-option :value="-1" label="已驳回"></el-option>
          </el-select>
        </el-form-item>
        <!-- 搜索重置展开按钮 -->
        <div class="headerTool-search-btns">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getDataList"
              >{{ $t("query") }}</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetDataForm()"
              >{{ $t("reset") }}</el-button
            >
            <el-button size="mini" plain @click="open">
              <i
                :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button>
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <el-form-item>
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="exportHandle"
                >{{ $t("export") }}</el-button
              >
            </el-form-item>
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip
                class="item"
                effect="dark"
                content="刷新"
                placement="top"
              >
                <el-button
                  size="small"
                  icon="el-icon-refresh"
                  circle
                  @click="query"
                ></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        @selection-change="dataListSelectionChangeHandle"
        :height="siteContentViewHeight"
        style="width: 100%"
        ref="table"
      >
        <el-table-column
          show-overflow-tooltip
          prop="realName"
          label="真实姓名"
          header-align="center"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="username"
          label="主播昵称"
          header-align="center"
          align="center"
          width="120"
        ></el-table-column>

        <el-table-column
          show-overflow-tooltip
          prop="phone"
          label="手机号码"
          header-align="center"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="idCard"
          label="身份证号"
          header-align="center"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="userType"
          label="认证类型"
          header-align="center"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.userType === 1 ? "个人" : "企业" }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createDate"
          label="申请时间"
          header-align="center"
          align="center"
          width="180"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="updateDate"
          label="审批时间"
          header-align="center"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? "" : scope.row.updateDate }}
          </template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          prop="status"
          label="状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="info">待审批</el-tag>
            <el-tag v-if="scope.row.status === 1" type="success">已通过</el-tag>
            <el-tag v-if="scope.row.status === -1" type="danger">已驳回</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-document"
              @click="openDetail(scope.row.id)"
              >查看</el-button
            >
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
        @current-change="pageCurrentChangeHandle"
      >
      </el-pagination>
    </div>
  </el-card>
</template>
  
  <script>
import mixinViewModule from "@/mixins/view-module";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "sys/anchor/applyInfo/bankInfoPage",
        getDataListIsPage: true,
        exportURL: "/sys/anchor/applyInfo/exportWithBank?type=1",
      },
      dataForm: {
        realName: "",
        idCard: "",
        username: "",
        phone: "",
        userType: "",
        status: "",
      },
    };
  },

  methods: {
    // 打开信息审批详情
    openDetail(id) {
      this.$router.push({
        path: "/anchor-anchorCertification-certificationDetail",
        query: { id },
      })
    },
  },

  mounted() {
    this.$bus.$on("change", () => {
      this.getDataList()
    })
  },
}
</script>
  