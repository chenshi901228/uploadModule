<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        label-width="100px"
        @keyup.enter.native="getDataList()"
      >
        <el-form-item
          label="主播昵称"
          prop="anchorName"
          v-if="isOpen || formItemCount >= 1"
        >
          <el-input
            placeholder="请输入"
            v-model="dataForm.anchorName"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="真实姓名"
          prop="realName"
          v-if="isOpen || formItemCount >= 2"
        >
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.realName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="phone"
          v-if="isOpen || formItemCount >= 3"
        >
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.phone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="身份证号"
          prop="idCard"
          v-if="isOpen || formItemCount >= 4"
        >
          <el-input
            style="width: 200px"
            placeholder="请输入"
            v-model="dataForm.idCard"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="性别"
          prop="gender"
          v-if="isOpen || formItemCount >= 5"
        >
          <el-select
            style="width: 200px"
            placeholder="请选择"
            v-model="dataForm.gender"
            clearable
          >
            <el-option :value="0" label="男"></el-option>
            <el-option :value="1" label="女"></el-option>
            <el-option :value="2" label="保密"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="账号状态"
          prop="disabledFlg"
          v-if="isOpen || formItemCount >= 6"
        >
          <el-select
            style="width: 200px"
            placeholder="请选择"
            v-model="dataForm.disabledFlg"
            clearable
          >
            <el-option :value="1" label="禁用"></el-option>
            <el-option :value="0" label="启用"></el-option>
          </el-select>
        </el-form-item>

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
            <el-button 
              type="warning"
              plain
              icon="el-icon-download" 
              size="mini"
              @click="exportHandle">{{ $t("export") }}</el-button>
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
          type="selection"
          header-align="center"
          align="center"
          width="50"
        ></el-table-column>
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
                scope.row.avatarUrl ||
                require('@/assets/img/default_avatar.png')
              "
              alt=""
              style="width: 60px; height: 60px"
            />
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
          min-width="110px"
          align="center"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="idCard"
          label="身份证号"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
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
          width="150"
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
          width="100"
        ></el-table-column>
        <!-- <el-table-column
          prop="dynamicGroupFlg"
          label="动态组授权"
          show-overflow-tooltip
          header-align="center"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.dynamicGroupFlg ? "已授权" : "未授权" }}</div>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="liveState"
          label="正在直播"
          show-overflow-tooltip
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.liveState ? 'success' : 'danger'">{{
              !scope.row.liveState ? "否" : "是"
            }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column
          prop="groupNum"
          label="群组数"
          show-overflow-tooltip
          header-align="center"
          align="center"
        >
        </el-table-column>      
        <el-table-column
          prop="disabledFlg"
          label="账号状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.disabledFlg ? 'danger' : 'success'">{{scope.row.disabledFlg ? "禁用" : "启用"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="通过时间"
          header-align="center"
          align="center"
          show-overflow-tooltip
          width="180"
        ></el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          min-width="160px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-c-scale-to-original"
              size="small"
              @click="openDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              type="text"
              icon="el-icon-edit"
              size="small"
              @click="editDetail(scope.row)"
              >编辑</el-button
            >
            <!-- <el-button
              type="text"
              icon="el-icon-sort"
              size="small"
              @click="forbidden(scope.row)"
              >{{ !scope.row.disabledFlg ? "禁用" : "解除" }}</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-edit-outline"
              v-if="!scope.row.dynamicGroupFlg"
              @click="impower(scope.row.weixinUserId, 1)"
              >授权</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-edit-outline"
              v-else
              @click="impower(scope.row.weixinUserId, 0)"
              >取消授权</el-button
            > -->
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
import { addDynamicRoute } from "@/router";
import Template from "../devtools/template.vue";
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/anchor/info/pageWithUserManage",
        exportURL: "/sys/anchor/info/pageWithUserManageExport", // 导出接口，API地址
        getDataListIsPage: true,
        deleteURL: "/sys/pay/order",
        deleteIsBatch: true,
      },
      dataForm: {
        nickName: "",
        phone: "",
        disabledFlg: null,
        realName: "",
        idCard: "",
        gender: "",
      },
      dataList: [],
    };
  },
  components: { Template },
  methods: {
    // 打开用户详情弹窗
    openDetail(data) {
      this.$router.push({
        path: "userManagement-hostDetail",
      });
      window.localStorage.setItem("hostDetailID", data.id);
    },
    //编辑
    editDetail(data) {
      // this.$router.push({
      //   name: "preview-editeUserInfo-EditeUserInfo",
      //   params: { info: data },
      // });
      console.log(data)
      let obj = {
        id:data.weixinUserId,
        username:data.username,
        introduce:data.introduce,
        avatarUrl:data.avatarUrl,
        qrCode:data.qrCode,
        type:'platform'
      }
      this.$router.push({
        path: "/userManagement-editeUserInfo-EditeUserInfo",
        query: { info: JSON.stringify(obj) },
      });
    },
    forbiddenHandle(type, data) {
      let url = "/sys/anchor/info/updateAnchorStatus";
      this.$http
        .post(url, { disabledFlg: type, id: data.id, phone: data.phone })
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
      if (row) {
        if (row.liveState == 1 && row.disabledFlg != 1)
          return this.$message.error("主播正在直播，无法禁用此账号");
        this.$confirm(
          `确认[${row.disabledFlg == 1 ? "解除" : "禁用"}]${row.username}?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.forbiddenHandle(row.disabledFlg == 1 ? 0 : 1, row);
          })
          .catch(() => {
            this.$message.info("已取消操作");
          });
      }
    },

    // 动态组授权、取消授权
    impower(id, type) {
      this.$http
        .put("sys/anchor/info/updateDynamicGroup", {
          weixinUserId: id,
          dynamicGroupFlg: type,
        })
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
  },
};
</script>
<style lang="scss"  scoped>
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
.diaBox {
  height: 500px;
  position: relative;
}
.diaBoxLeft {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  bottom: 0;
  overflow: auto;
  padding: 10px;
  border: 5px solid #cccccc69;
}
.diaBoxRight {
  position: absolute;
  top: 0;
  right: 0;
  left: 300px;
  bottom: 0;
  overflow: auto;
  padding: 10px;
  border: 5px solid #cccccc69;
}
.diaBoxLeft_title {
  margin-bottom: 20px;
  border-left: 5px solid #409eff;
  padding-left: 5px;
  line-height: 19px;
  height: 16px;
}
.diaBoxLeft_mes {
  padding: 0 10px 20px 10px;
}

.diaBoxRight_tabBtns {
  border-width: 0px;
  width: 100px;
  height: 45px;
  text-align: center;
  cursor: pointer;
  line-height: 45px;
  background: inherit;
  background-color: rgba(242, 242, 242, 1);
  border: none;
  border-radius: 0px;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.is-active {
  background-color: rgba(107, 107, 107, 1);
  color: #fff;
}

/deep/.el-dialog {
  display: flex;
  display: -ms-flex; /* 兼容IE */
  flex-direction: column;
  -ms-flex-direction: column; /* 兼容IE */
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
/deep/.el-dialog .el-dialog__body {
  padding: 20px; /*这个不重要*/
  max-height: 75vh;
  flex: 1;
  -ms-flex: 1 1 auto; /* 兼容IE */
  overflow-y: auto;
  overflow-x: hidden;
}

/deep/.el-dialog__wrapper {
  overflow: hidden; /*隐藏ie和edge中遮罩的滚动条*/
}
</style>