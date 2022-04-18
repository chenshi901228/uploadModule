<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-gift__sysgift">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="dataForm"
        size="small"
        @keyup.enter.native="getDataList"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="礼物名称" prop="name">
              <el-input v-model.trim="dataForm.name" clearable placeholder="礼物名称"></el-input>
              <!-- <el-select
                style="width:100%"
                v-model="dataForm.name"
                filterable
                remote
                reserve-keyword
                clearable
                placeholder="请输入选择"
                :remote-method="getGiftInfo"
                :loading="loading">
                  <el-option
                    v-for="item in giftOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否免费" prop="isFree">
              <el-select
                clearable
                v-model="dataForm.isFree"
                placeholder="请选择"
              >
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上架状态" prop="status">
              <el-select
                clearable
                v-model="dataForm.status"
                placeholder="请选择"
              >
                <el-option label="上架" :value="1"></el-option>
                <el-option label="下架" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="float: right; padding-right: 10px">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="addOrUpdateHandle()"
                >{{ $t("add") }}</el-button
              >
              <el-button size="small" type="info" @click="exportHandle()">{{
                $t("export")
              }}</el-button>
              <el-button size="small" type="primary" @click="getDataList">{{
                $t("query")
              }}</el-button>
              <el-button size="small" @click="resetDataForm()">{{
                $t("reset")
              }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
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
          prop="icon"
          label="礼物图标"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <img
              :src="
                scope.row.icon &&
                (scope.row.icon.indexOf('http:') > -1 ||
                  scope.row.icon.indexOf('https:') > -1)
                  ? scope.row.icon
                  : 'https://' + scope.row.icon
              "
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="dynamicIcon"
          label="礼物动画"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <img
              :src="
                scope.row.dynamicIcon &&
                (scope.row.dynamicIcon.indexOf('http:') > -1 ||
                  scope.row.dynamicIcon.indexOf('https:') > -1)
                  ? scope.row.dynamicIcon
                  : 'https://' + scope.row.dynamicIcon
              "
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="礼物名称"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="礼物价格"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isFree"
          label="是否免费"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isFree === 0" size="small" type="danger"
              >否</el-tag
            >
            <el-tag v-else size="small" type="success">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateDate"
          label="更新时间"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="上架状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.delFlg === 0 && scope.row.status !== 1"
              size="small"
              type="danger"
              >下架</el-tag
            >
            <el-tag
              v-if="scope.row.delFlg === 0 && scope.row.status === 1"
              size="small"
              type="success"
              >上架</el-tag
            >
            <el-tag v-if="scope.row.delFlg === 1" size="small" type="danger"
              >已删除</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('handle')"
          fixed="right"
          header-align="center"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.delFlg === 0"
              type="text"
              size="small"
              @click="addOrUpdateHandle(scope.row.id)"
              >{{ $t("update") }}</el-button
            >
            <el-button
              v-if="scope.row.delFlg === 0 && scope.row.status !== 1"
              type="text"
              size="small"
              @click="updateStatus(scope.row.id, 1)"
              >上架</el-button
            >
            <el-button
              v-if="scope.row.delFlg === 0 && scope.row.status === 1"
              type="text"
              size="small"
              @click="updateStatus(scope.row.id, 0)"
              >下架</el-button
            >
            <el-button
              v-if="scope.row.delFlg === 0"
              type="text"
              size="small"
              @click="deleteHandle(scope.row.id)"
              >{{ $t("delete") }}</el-button
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
import AddOrUpdate from "./sysgift-add-or-update";
import debounce from "lodash/debounce";

export default {
  mixins: [mixinViewModule],
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/sys/sys/gift/page",
        getDataListIsPage: true,
        exportURL: "/sys/sys/gift/export",
        deleteURL: "/sys/sys/gift",
        deleteIsBatch: true,
      },
      dataForm: {
        name: "",
        isFree: null,
        status: null,
      },
      loading: false, //礼物输入下拉选择loading
      giftOptions: [] //礼物下拉选择内容
    };
  },
  watch: {},
  components: {
    AddOrUpdate,
  },
  methods: {
    // 输入选择礼物
    getGiftInfo(s) {
      if(s != ""){
        this.loading = true
        this.$http.get("/sys/anchor/info/getSysAnchorInfos/" + s).then(({ data: res }) => {
          this.loading = false
          if(res.code == 0) {
            let arr = []
            res.data.map(item => {
              arr.push({
                value: JSON.stringify({
                    anchorUser: item.username,
                    anchorTel: item.phone,
                    anchorUserId: item.weixinUserId
                }),
                label: `主播：${item.username}  手机号：${item.phone}`
              })
            })
            this.giftOptions = arr
          }else {
            this.giftOptions = []
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.loading = false
          this.giftOptions = []
          throw err
        })
      }else {
        this.giftOptions = []
      }
    },
    // 修改状态
    updateStatus: debounce(
      function (id, status) {
        let dataForm = {
          id,
          status,
        };
        this.$confirm(
          `是否执行 [${status == 0 ? "下架" : "上架"}] 操作`,
          this.$t("prompt.title"),
          {
            confirmButtonText: this.$t("confirm"),
            cancelButtonText: this.$t("cancel"),
            type: "warning",
          }
        )
          .then(() => {
            this.$http["put"]("/sys/sys/gift/updateStatus", dataForm)
              .then(({ data: res }) => {
                if (res.code !== 0) {
                  return this.$message.error(res.msg);
                }
                this.$message({
                  message: this.$t("prompt.success"),
                  type: "success",
                  duration: 500,
                  onClose: () => {
                    this.query();
                  },
                });
              })
              .catch(() => {});
          })
          .catch(() => {});
      },
      1000,
      { leading: true, trailing: false }
    ),
  },
};
</script>
