<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        label-width="100px"
        @keyup.enter.native="getDataList()"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input
                size="small"
                v-model="dataForm.nickName"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="phone">
              <el-input
                size="small"
                v-model="dataForm.phone"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邀请人" prop="inviteUserName">
              <el-input
                size="small"
                v-model="dataForm.inviteUserName"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <div v-if="isOpen">
            <el-row>
              <el-col :span="8">
                <el-form-item label="邀请人号码" prop="invitePhone">
                  <el-input
                    size="small"
                    v-model="dataForm.invitePhone"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态" prop="status">
                  <el-select size="small" v-model="dataForm.status" clearable>
                    <el-option :value="1" label="正常"></el-option>
                    <el-option :value="0" label="停用"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-col :span="24">
            <el-form-item style="float: right; padding-right: 10px">
              <el-button size="small" type="danger" @click="forbidden()"
                >禁用</el-button
              >
              <el-button size="small" type="primary" @click="getDataList()">{{
                $t("query")
              }}</el-button>
              <el-button size="small" @click="resetDataForm()">{{
                $t("reset")
              }}</el-button>
              <el-button size="small" type="primary" @click="open">
                {{ isOpen ? "收起" : "展开"
                }}<i
                  style="margin-left: 10px"
                  :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                ></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="是否认证">
          <el-select v-model="dataForm.status">
            <el-option value="1" label="是"></el-option>
            <el-option value="0" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否是指导师">
          <el-select v-model="dataForm.status">
            <el-option value="1" label="是"></el-option>
            <el-option value="0" label="否"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        :height="siteContentViewHeight"
        style="width: 100%"
        ref="table"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="avatarUrl"
          label="用户头像"
          header-align="center"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.avatarUrl || require('@/assets/img/default_avatar.png')"
              alt=""
              style="width: 60px; height: 60px"
            />
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="nickName"
          label="用户昵称"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="phone"
          label="手机号码"
          header-align="center"
          align="center"
        >
        </el-table-column>
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
        >
          <template slot-scope="scope">
            {{ scope.row.tutorFlg === 1 ? "认证" : "未认证" }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="inviteUserName"
          label="邀请人"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="invitePhone"
          label="邀请人号码"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createDate"
          label="注册时间"
          header-align="center"
          align="center"
          width="180"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createDate"
          label="状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.status == 0 ? "停用" : "正常" }}</div>
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
            <el-button type="text" size="small" @click="openDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="!scope.row.delFlg"
              @click="forbidden(scope.row)"
              >{{ scope.row.status != 0 ? "禁用" : "解除" }}</el-button
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
        getDataListURL: "/sys/manage/weixinUser/page",
        getDataListIsPage: true,
        deleteURL: "/sys/pay/order",
        deleteIsBatch: true,
      },
      dataForm: {
        nickName: "",
        phone: "",
        inviteUserName:"",
        invitePhone:"",
        status: "",
      },
      dataList: [{ createDate: 1 }],
      userId: "",
    };
  },
  components: { Template },
  methods: {
    // 打开用户详情弹窗
    openDetail(data) {
      this.$router.push({
        name: "userManagement-userDetail",
      });
      window.localStorage.setItem("userDetailData", JSON.stringify(data));
    },
    //
    forbiddenHandle(type, data) {
      let url = type
        ? "/sys/manage/weixinUser/startUsing"
        : "/sys/manage/weixinUser/forbiddenUsere";
      this.$http
        .put(url, { userIds: data })
        .then(({ data: res }) => {
          if (res.code == 0) {
            this.$message.success("操作成功");
            this.query();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 禁用，解除用户
    forbidden(row) {
      if (!row) {
        //批量操作---禁用
        if (!this.dataListSelections.length) {
          //未选中
          return this.$message.warning("请选择禁用用户");
        } else {
          this.$confirm(`此操作将禁用选中用户, 是否继续?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              let arr = this.dataListSelections.map((item) => item.id);
              this.forbiddenHandle(0, arr);
            })
            .catch(() => {
              this.$message.info("已取消操作");
            });
        }
      } else {
        //单个操作
        this.$confirm(`确认[${row.status == 0 ? "解除" : "禁用"}]${row.nickName}?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.forbiddenHandle(row.status == 0 ? 1 : 0, [row.id]);
          })
          .catch(() => {
            this.$message.info("已取消操作");
          });
      }
    },
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