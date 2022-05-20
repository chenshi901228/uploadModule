<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-message__sms">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm_fans"
        size="small"
        label-width="100px"
        @keyup.enter.native="getDataList"
      >
        <el-form-item v-if="isOpen || formItemCount >= 1" label="粉丝团名称" prop="title">
          <el-input
            style="width: 200px"
            v-model="dataForm.title"
            placeholder="粉丝团名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 2" label="主播昵称" prop="username">
          <el-input
            style="width: 200px"
            v-model="dataForm.username"
            placeholder="主播昵称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 3" label="手机号码" prop="phone">
          <el-input
            style="width: 200px"
            v-model="dataForm.phone"
            placeholder="手机号码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 4" label="状态" prop="disabledFlg">
          <el-select
            style="width: 200px"
            v-model="dataForm.disabledFlg"
            clearable
            placeholder="状态"
          >
            <el-option value="1" label="禁用"></el-option>
            <el-option value="0" label="正常"></el-option>
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
              @click="resetDataForm()">{{ $t("reset") }}</el-button>
            <el-button size="mini" plain @click="open">
              <i :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              {{ isOpen ? "收起" : "展开" }}
            </el-button>
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <div class="headerTool-handle-btns">
          <div class="headerTool--handle-btns-left">
            <!-- <el-form-item>
              <el-button 
                type="warning"
                plain
                icon="el-icon-download" 
                size="mini"
                @click="exportHandle">{{ $t("export") }}</el-button>
            </el-form-item> -->
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="small" icon="el-icon-refresh" circle @click="getDataList"></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        :height="siteContentViewHeight"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%"
        ref="table"
      >
        <el-table-column
          prop="title"
          label="粉丝团名称"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="username"
          label="主播昵称"
          header-align="center"
          align="center"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="fansNum"
          label="粉丝团成员"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="disabledFlg"
          label="状态"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>{{ scope.row.delFlg ? "禁用" : "正常" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-user"
              @click="openfansListDIa(scope.row)"
              >成员列表</el-button
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

      <!-- 粉丝团成员列表-->
      <el-dialog
        title="粉丝团成员列表"
        :visible.sync="dialogVisible_fans"
        width="1300px"
        top="20px"
      >
        <div style="margin: 10px 0">
          <el-form
            :inline="true"
            :model="dataForm_fans"
            @keyup.enter.native="queryPost_fans()"
            ref="dataForm_fans"
            size="small"
          >
            <el-form-item label="用户昵称" prop="userName">
              <el-input
                v-model="dataForm_fans.userName"
                placeholder="用户昵称"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="dataForm_fans.phone"
                placeholder="手机号码"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="用户等级" prop="level">
              <el-select
                v-model="dataForm_fans.level"
                clearable
              >
                <el-option v-for="item in 11" :key="item" :value="(item - 1) + ''" :label="(item - 1) + ''"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="粉丝团身份" prop="userType">
              <el-select
                v-model="dataForm_fans.userType"
                clearable
              >
                <el-option :value="0" label="普通会员"></el-option>
                <el-option :value="1" label="会长"></el-option>
                <el-option :value="2" label="副会长"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                size="mini"
                type="primary"
                @click="queryPost_fans()"
                >{{ $t("query") }}</el-button
              >
              <el-button
                size="mini"
                @click="queryPost_fans_reset"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div style="display: flex; margin: 10px 0 20px">
          <div>粉丝团名称：{{ detailForm.title }}</div>
          <div style="margin: 0 60px">主播昵称：{{ detailForm.username }}</div>
          <div>成员总数：{{ detailForm.fansNum }}人</div>
        </div>
        <el-table v-loading="loading_fans" :data="dataList_fans" style="width: 100%" height="400px">
          <el-table-column
            prop="avatarUrl"
            label="用户头像"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <img
                :src="scope.row.avatarUrl"
                alt=""
                style="width: 75px; height: 50px"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="用户昵称"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="phone"
            label="手机号码"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="intimacyNum"
            label="亲密度"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="level"
            label="用户等级"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="userType"
            label="粉丝团身份"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.userType === 0
                    ? "普通会员"
                    : scope.row.userType === 1
                    ? "会长"
                    : "副会长"
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="入团时间"
            header-align="center"
            align="center"
          ></el-table-column>
        </el-table>
        <el-pagination
          background
          :current-page="page_fans"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit_fans"
          :total="total_fans"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle_fans"
          @current-change="pageCurrentChangeHandle_fans"
        >
        </el-pagination>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      dataList: [
        {
          aaa: 1,
        },
      ],
      mixinViewModuleOptions: {
        getDataListURL: "/sys/anchor/info/pageWithFans",
        getDataListIsPage: true,
      },

      dataForm: {
        title: "",
        username: "",
        phone: "",
        disabledFlg: "",
      },
      sendVisible: false,

      // 粉丝团成员列表弹窗
      dialogVisible_fans: false,
      fansId: "",
      detailForm: {},
      dataForm_fans: {
        userName: "",
        phone: "",
        userType: "",
        level: "",
      },
      dataList_fans: [],
      loading_fans: false,
      page_fans: 1, // 当前页码
      limit_fans: 10, // 每页数
      total_fans: 0,
    };
  },
  components: {},
  activated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout();
    });
  },
  methods: {
    // 打开粉丝团成员列表弹窗
    openfansListDIa(row) {
      this.dialogVisible_fans = true;
      this.fansId = row.id;
      this.detailForm = row;
      (this.dataForm_fans = {
        userName: "",
        phone: "",
        level: "",
        userType: "",
      }),
        this.queryPost_fans();
    },
    // 获取粉丝团成员列表数据
    queryPost_fans() {
      this.loading_fans = true
      let data = {
        page: this.page_fans,
        limit: this.limit_fans,
        anchorId: this.fansId,
        ...this.dataForm_fans
      };
      this.$http
        .get(`/sys/manage/weixinUser/anchor/fans/achorFansWeixinUserInfoPage`, {
          params: this.$httpParams(data),
        })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.dataList_fans = [];
            this.total_fans = 0;
            return this.$message.error(res.msg);
          }
          this.dataList_fans = res.data.list;
          this.total_fans = res.data.total;
          this.loading_fans = false
        })
        .catch(() => {
          this.loading_fans = false
        });
    },
    // 粉丝团成员列表重置
    queryPost_fans_reset() {
      this.$refs.dataForm_fans.resetFields()
      this.queryPost_fans()
    },
    // 分页, 每页条数
    pageSizeChangeHandle_fans(val) {
      this.page_fans = 1;
      this.limit_fans = val;
      this.queryPost_fans();
    },
    // 分页, 当前页
    pageCurrentChangeHandle_fans(val) {
      this.page_fans = val;
      this.queryPost_fans();
    },
  },
  computed: {
  },
  created() {},
  filters: {
    formatDate: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    },
  },
};
</script>
