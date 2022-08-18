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
        <el-form-item v-if="isOpen || formItemCount >= 1" label="真实姓名" prop="realName">
          <el-input
            style="width: 200px"
            placeholder="真实姓名"
            v-model="dataForm.realName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 2" label="手机号码" prop="phone">
          <el-input
            style="width: 200px"
            placeholder="手机号码"
            v-model="dataForm.phone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 3" label="身份证号" prop="idCard">
          <el-input
            style="width: 200px"
            placeholder="身份证号"
            v-model="dataForm.idCard"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 4" label="性别" prop="gender">
          <el-select 
            style="width: 200px"
            placeholder="性别" 
            v-model="dataForm.gender" 
            clearable>
            <el-option :value="0" label="男"></el-option>
            <el-option :value="1" label="女"></el-option>
            <el-option :value="2" label="保密"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 5" label="主播昵称" prop="username">
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.username"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 6" label="认证类型" prop="userType">
          <el-select 
            style="width: 200px"
            placeholder="请选择" 
            v-model="dataForm.userType" 
            clearable>
            <el-option :value="1" label="个人"></el-option>
            <el-option :value="2" label="企业"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 7" label="审核类型" prop="updateType">
          <el-select 
            style="width: 200px"
            placeholder="请选择" 
            v-model="dataForm.updateType" 
            clearable>
            <el-option :value="1" label="主播申请"></el-option>
            <el-option :value="2" label="账户信息"></el-option>
            <!-- <el-option :value="3" label="修改简介"></el-option>
            <el-option :value="4" label="修改头像"></el-option>
            <el-option :value="5" label="主播二维码"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item v-if="isOpen || formItemCount >= 8" label="审批状态" prop="status">
          <el-select 
            style="width: 200px"
            placeholder="请选择" 
            v-model="dataForm.status" 
            clearable>
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
            <el-form-item>
              <!-- <el-button 
                type="warning"
                plain
                icon="el-icon-download" 
                size="mini"
                @click="exportHandle">{{ $t("export") }}</el-button> -->
            </el-form-item>
          </div>
          <div class="headerTool--handle-btns-right">
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="small" icon="el-icon-refresh" circle @click="query"></el-button>
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
        <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="weixinUserId" label="主播ID" header-align="center" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="avatarUrl" label="头像" header-align="center" align="center">
           <template slot-scope="scope">
             <img :src="scope.row.avatarUrl" style="width:100px;height:100px;">
          </template>
        </el-table-column>
        <el-table-column prop="backgroundImage" label="背景图" header-align="center" align="center">
           <template slot-scope="scope">
             <img :src="scope.row.backgroundImage" style="width:100px;height:100px;">
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" header-align="center" align="center">
          <template slot-scope="scope">
             <el-tag v-if="scope.row.status === 0" type="info">男</el-tag>
             <el-tag v-if="scope.row.status === 1" type="info">女</el-tag>
             <el-tag v-if="scope.row.status === 2" type="info">保密</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="introduce" label="介绍" header-align="center" align="center"></el-table-column>
        <el-table-column prop="legalizeFlg" label="认证用户" header-align="center" align="center">
          <template slot-scope="scope">
             {{ scope.row.legalizeFlg === 1 ? '认证' : '未认证' }}
          </template>
        </el-table-column>
        <el-table-column prop="tutorFlg" label="是否导师" header-align="center" align="center">
          <template slot-scope="scope">
             {{ scope.row.tutorFlg === 1 ? '认证' : '未认证' }}
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="申请时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateDate" label="操作时间" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? '' : scope.row.updateDate }}
          </template>
        </el-table-column> -->

        <!-- <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column> -->
        <el-table-column
          prop="avatarUrl"
          label="主播头像"
          header-align="center"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <img
              :src="
                scope.row.avatarUrl || require('@/assets/img/default_avatar.png')"
              style="width: 60px; height: 60px"
            />
          </template>
        </el-table-column>
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
          prop="gender"
          label="性别"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.gender === 0" type="info">男</el-tag>
            <el-tag v-if="scope.row.gender === 1" type="info">女</el-tag>
            <el-tag v-if="scope.row.gender === 2" type="info">保密</el-tag>
          </template>
        </el-table-column>
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
          prop="introduce"
          label="主播介绍"
          header-align="center"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="legalizeFlg"
          label="是否认证"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.legalizeFlg === 1 ? "认证" : "未认证" }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="tutorFlg"
          label="是否是指导师"
          header-align="center"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.tutorFlg === 1 ? "认证" : "未认证" }}
          </template>
        </el-table-column>
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
          prop="attestAmount"
          label="验证金额"
          header-align="center"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="updateType"
          label="审核类型"
          header-align="center"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.updateType==1?'主播申请':scope.row.updateType==2?'账户信息':'-' }}
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
        <!-- <el-table-column
          show-overflow-tooltip
          prop="remark"
          label="备注"
          header-align="center"
          align="center"
          width="180"
        ></el-table-column> -->
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
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getDataList"
      ></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import AddOrUpdate from "./sysanchorinfo-add-or-update";
import debounce from "lodash/debounce";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/anchor/applyInfo/addPage",
        getDataListIsPage: true,
        exportURL: "/sys/anchor/info/export",
        deleteURL: "/sys/anchor/info",
        deleteIsBatch: true,
      },
      dataForm: {
        realName: "",
        idCard: "",
        username: "",
        phone: "",
        gender: "",
        userType:"",
        updateType:"",
        status: "",
      },
    };
  },
  watch: {},
  components: {
    AddOrUpdate,
  },
  methods: {
     // 打开信息审批详情
    openDetail(id) {
      this.$router.push({
        path: "/anchor-sysanchorinfoDetail",
        query:{id}
      });
      // window.localStorage.setItem("sysanchorinfoDetailData", JSON.stringify(data));
    },
  },
   mounted() {
    this.$bus.$on("change", () => {
      this.getDataList();
    });
  },
 
};
</script>
