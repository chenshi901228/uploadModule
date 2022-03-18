<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item label="主播昵称">
          <el-input v-model="dataForm.anchorName" clearable></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="dataForm.realName" clearable></el-input>
        </el-form-item>

        <el-form-item label="手机号码">
          <el-input v-model="dataForm.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="dataForm.idCard" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="dataForm.gender" clearable>
            <el-option :value="0" label="男"></el-option>
            <el-option :value="1" label="女"></el-option>
            <el-option :value="2" label="保密"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select v-model="dataForm.disabledFlg" clearable>
            <el-option value="1" label="禁用"></el-option>
            <el-option value="0" label="正常"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="avatarUrl"
          label="主播头像"
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
          prop="username"
          label="主播昵称"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="realName"
          label="真实姓名"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="idCard"
          label="身份证号"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.gender === 0
                  ? "男"
                  : scope.row.gender === 1
                  ? "女"
                  : "保密"
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="introduce"
          label="主播介绍"
          show-overflow-tooltip
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="attentionNum"
          label="关注人数"
          show-overflow-tooltip
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="fansNum"
          label="粉丝团成员"
          show-overflow-tooltip
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="liveState"
          label="正在直播"
          show-overflow-tooltip
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.liveState ? "未直播" : "直播中" }}</div>
          </template>
        </el-table-column>

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
          label="通过时间"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="!scope.row.delFlg"
              @click="forbidden(scope.row.id)"
              >禁用</el-button
            >
            <el-button
              type="text"
              size="small"
              v-else
              @click="forbidden(scope.row.id)"
              >解除</el-button
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
 
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from "@/mixins/view-module";
import { addDynamicRoute } from "@/router";
import Template from "../devtools/template.vue";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/anchor/info/pageWithUserManage",
        getDataListIsPage: true,
        deleteURL: "/sys/pay/order",
        deleteIsBatch: true,
      },
      dataForm: {
        nickName: "",
        phone: "",
        disabledFlg: "",
        realName: "",
        idCard: "",
        gender: "",
      },
      dataList: [{ createDate: 1 }],
    };
  },
  components: { Template },
  methods: {
    // 打开用户详情弹窗
    openDetail(data) {
      this.$router.push({
        name: "userManagement-hostDetail",
        params:{data:data}
      })
    },
  

    forbiddenAll() {
      console.log(this.dataListSelections);
    },
    // 禁用，解除用户
    forbidden(id) {},
  },
};
</script>
<style  scoped>
.forbiddenAllBtn {
  width: 120px;
  height: 35px;
  background: #409eff;
  border-radius: 5px;
  color: #fff;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  margin: 10px 0;
}

</style>