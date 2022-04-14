<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-pay__order">
      <el-form
        class="headerTool"
        :inline="true"
        :model="dataForm"
        ref="complainsRecords"
        @keyup.enter.native="getDataList()"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input
                size="small"
                v-model="dataForm.username"
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
            <el-form-item label="投诉分类" prop="delFlg">
              <el-select size="small" v-model="dataForm.type" clearable>
                <el-option :value="1" label="平台投诉"></el-option>
                <el-option :value="2" label="直播间投诉"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <div v-if="isOpen">
            <el-row>
              <el-col :span="8">
                <el-form-item label="投诉标签" prop="delFlg">
                  <el-select size="small" v-model="dataForm.tag" clearable>
                    <el-option value="违法违禁" label="违法违禁"></el-option>
                    <el-option value="淫秽色情" label="淫秽色情"></el-option>
                    <el-option value="欺诈/售假" label="欺诈/售假"></el-option>
                    <el-option
                      value="未成年人相关"
                      label="未成年人相关"
                    ></el-option>
                    <el-option value="危险行为" label="危险行为"></el-option>
                    <el-option value="录像/盗播" label="录像/盗播"></el-option>
                    <el-option
                      value="引导线下转账"
                      label="引导线下转账"
                    ></el-option>
                    <el-option value="诱导刷礼" label="诱导刷礼"></el-option>
                    <el-option value="侮辱谩骂" label="侮辱谩骂"></el-option>
                    <el-option value="其他" label="其他"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="处理状态" prop="delFlg">
                  <el-select
                    size="small"
                    v-model="dataForm.handlingStatus"
                    clearable
                  >
                    <el-option :value="1" label="已处理"></el-option>
                    <el-option :value="0" label="未处理"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-col :span="24">
            <el-form-item style="float: right; padding-right: 10px">
              <el-button type="info" size="small" @click="exportHandle()">{{
                $t("export")
              }}</el-button>
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
          prop="username"
          label="用户昵称"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          min-width="100px"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="投诉分类"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.type == 1 ? "平台投诉" : "直播间投诉" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="投诉标签"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="content"
          label="投诉内容"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="contactPhone"
          label="联系电话"
          min-width="100px"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="投诉时间"
          min-width="150px"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="solution"
          label="处理方案"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="handler"
          label="处理人"
          header-align="center"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="handlingTime"
          label="处理时间"
          min-width="150px"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="handlingStatus"
          label="处理状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.handlingStatus ? "处理" : "未处理" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="liveId"
          label="关联直播间"
          header-align="center"
          align="center"
        >
        </el-table-column>
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
        getDataListURL: "/sys/manage/complaint/page",
        getDataListIsPage: true,
        deleteIsBatch: true,
        exportURL: "/sys/manage/complaint/export",
      },
      dataForm: {
        nickName: "",
        phone: "",
        delFlg: "",
      },
      dataList: [{ createDate: 1 }],
      userId: "",

      otherViewHeight: 0, //搜索栏高度
      isOpen: false, //搜索栏展开/收起
    };
  },
  components: { Template },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.documentClientHeight;
      },
    },
    siteContentViewHeight() {
      var height =
        this.documentClientHeight -
        this.otherViewHeight -
        (50 + 40 + 30 + 40 + 47);
      return height;
    },
  },
  watch: {
    isOpen() {
      this.setOtherViewHeight();
    },
  },
  activated() {
    this.setOtherViewHeight();
    this.$nextTick(() => {
      this.$refs.table.doLayout();
    });
  },
  mounted() {
    this.$bus.$on("change", () => {
      this.getDataList();
    });
  },
  methods: {
    // 搜索栏高度设置
    setOtherViewHeight() {
      setTimeout(() => {
        if (document.querySelector(".headerTool")) {
          let h = document
            .querySelector(".headerTool")
            .getBoundingClientRect().height;
          this.otherViewHeight = Math.ceil(h);
        }
      }, 150);
    },
    // 搜索栏收起/展开
    open() {
      this.isOpen = !this.isOpen;
      this.resetDataForm();
    },
    // 打开用户详情弹窗
    openDetail(data) {
      this.$router.push({
        name: "anchor-complainsDetail",
      });
      window.localStorage.setItem("complainsDetailID", data.id);
    },

    forbiddenAll() {
      console.log(this.dataListSelections);
    },
    // 禁用，解除用户
    forbidden(id) {},

    // 重置搜索条件
    resetDataForm() {
      this.$refs.complainsRecords.resetFields();
      this.getDataList();
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