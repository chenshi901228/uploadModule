<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-message__sms">
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item label="粉丝团名称">
          <el-input
            v-model="dataForm.title"
            placeholder="粉丝团名称" clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="主播昵称">
          <el-input
            v-model="dataForm.username"
            placeholder="主播昵称" clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="dataForm.phone" placeholder="手机号码" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="dataForm.disabledFlg" clearable>
            <el-option value="1" label="禁用"></el-option>
            <el-option value="0" label="正常"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        :height="siteContentViewHeight"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%"
      >
        <el-table-column
          prop="title"
          label="粉丝团名称"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="主播昵称"
          header-align="center"
          align="center"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="fansNum"
          label="粉丝团成员"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="disabledFlg"
          label="状态"
          header-align="center"
          align="center"
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
              @click="openfansListDIa(scope.row)"
              >成员列表</el-button
            >
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
        @current-change="pageCurrentChangeHandle"
      >
      </el-pagination>

      <!-- 粉丝团成员列表-->
      <el-dialog
        title="粉丝团成员列表"
        :visible.sync="dialogVisible_fans"
        width="1300px"
      >
        <div style="margin: 10px 0">
          <el-form
            :inline="true"
            :model="dataForm"
            @keyup.enter.native="queryPost_fans()"
          >
            <el-form-item label="用户昵称">
              <el-input
                v-model="dataForm_fans.userName"
                placeholder="用户昵称"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input
                v-model="dataForm_fans.phone"
                placeholder="手机号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户等级">
              <el-input
                v-model="dataForm_fans.level"
                placeholder="用户等级"
              ></el-input>
            </el-form-item>
            <el-form-item label="粉丝团身份">
              <el-select v-model="dataForm_fans.userType" clearable>
                <el-option :value="0" label="普通会员"></el-option>
                <el-option :value="1" label="会长"></el-option>
                <el-option :value="2" label="副会长"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="queryPost_fans()">{{ $t("query") }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div style="display:flex;margin: 10px 0 20px">
          <div>粉丝团名称：{{detailForm.title}}</div>
          <div style="margin:0 60px">主播昵称：{{detailForm.username}}</div>
          <div>成员总数：{{detailForm.fansNum}}人</div>
        </div>
        <el-table :data="dataList_fans" style="width: 100%" height="400px">
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
              <div>{{scope.row.userType===0?'普通会员':scope.row.userType===1?'会长':'副会长'}}</div>
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
      dataList:[{
        aaa:1
      }],
      otherViewHeight:65,
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
      detailForm:{},
      dataForm_fans: {
        userName: "",
        phone: "",
        userType: "",
        level: "",
      },
      dataList_fans: [],
      page_fans: 1, // 当前页码
      limit_fans: 10, // 每页数
      total_fans: 0,
    };
  },
  components: {},
  methods: {
    // 打开粉丝团成员列表弹窗
    openfansListDIa(row) {
      this.dialogVisible_fans = true;
      this.fansId = row.id;
      this.detailForm=row
      this.dataForm_fans = {
        userName: "",
        phone: "",
        level: "",
        userType: "",
      },
      
        this.queryPost_fans();
    },
    // 获取粉丝团成员列表数据
    queryPost_fans() {
      let data = {
        page: this.page_fans,
        limit: this.limit_fans,
        anchorId: this.fansId,
        nickName: this.dataForm_fans.nickName,
        userType: this.dataForm_fans.userType,
        phone: this.dataForm_fans.phone,
        level: this.dataForm_fans.level,
      };
      this.$http
        .get(`/sys/manage/weixinUser/anchor/fans/achorFansWeixinUserInfoPage`, { params: data })
        .then(({ data: res }) => {
          if (res.code !== 0) {
            this.dataList_fans = [];
            this.total_fans = 0;
            return this.$message.error(res.msg);
          }
          this.dataList_fans = res.data.list;
          this.total_fans = res.data.total;
        })
        .catch(() => {});
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
    documentClientHeight: {
      get() {
          return this.$store.state.documentClientHeight;
      },
    },
    siteContentViewHeight() {
      var height = this.documentClientHeight - this.otherViewHeight - ( 50 + 40 + 30 + 40 + 47 );
      return height;
    },
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
